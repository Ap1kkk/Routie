package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.recommendation.RecommendationFilter;
import ru.ngtu.v1.routie.dto.route.RouteType;
import ru.ngtu.v1.routie.dto.route.response.RouteShortResponse;
import ru.ngtu.v1.routie.dto.tag.TagResponse;
import ru.ngtu.v1.routie.exception.EntityNotFoundException;
import ru.ngtu.v1.routie.model.Route;
import ru.ngtu.v1.routie.model.UserProfile;
import ru.ngtu.v1.routie.repository.*;
import ru.ngtu.v1.routie.security.CustomUserDetails;
import ru.ngtu.v1.routie.service.RecommendationService;

import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    /**
     * Размер пула популярных маршрутов для выбора «маршрута дня».
     * Берём top-N по completionsCount, чтобы менее популярные маршруты не попадали в ротацию.
     */
    private static final int DAILY_ROUTE_POOL_SIZE = 100;

    /**
     * Веса для score-алгоритма персональных рекомендаций.
     * tagMatch * TAG_WEIGHT + (notCompleted ? NOT_COMPLETED_BONUS : 0) + min(completionsCount / POPULARITY_DIVISOR, POPULARITY_CAP)
     */
    private static final int TAG_WEIGHT          = 3;
    private static final int NOT_COMPLETED_BONUS = 2;
    private static final int POPULARITY_DIVISOR  = 10;
    private static final int POPULARITY_CAP      = 5;

    private final RouteRepository routeRepository;
    private final RouteSessionRepository routeSessionRepository;
    private final UserProfileRepository userProfileRepository;
    private final TagRepository tagRepository;
    private final MediaFileRepository mediaFileRepository;

    // ==================== Маршрут дня ====================

    /**
     * Детерминированный персональный «маршрут дня».
     *
     * Алгоритм:
     * 1. Берём топ-{@value DAILY_ROUTE_POOL_SIZE} активных маршрутов по популярности (completionsCount DESC).
     * 2. Вычисляем seed = epochDay * большое_простое + старшие_биты_userId.
     *    Это гарантирует: один и тот же маршрут в течение дня, разные маршруты у разных пользователей.
     * 3. index = abs(seed) % pool.size()
     *
     * Преимущества: нет состояния в БД, стабильно при рестарте, учитывает популярность.
     */
    @Override
    @Transactional(readOnly = true)
    public RouteShortResponse getDailyRoute() {
        PageRequest top = PageRequest.of(0, DAILY_ROUTE_POOL_SIZE,
                Sort.by("completionsCount").descending());

        List<Route> pool = routeRepository.findAll(
                (root, q, cb) -> cb.isTrue(root.get("isActive")),
                top
        ).getContent();

        if (pool.isEmpty()) {
            throw new EntityNotFoundException("Нет доступных маршрутов для выбора маршрута дня");
        }

        UUID userId = getCurrentUserId();
        long epochDay = LocalDate.now().toEpochDay();

        // Смешиваем дату и userId: Knuth multiplicative hashing
        long seed = (epochDay * 2654435761L) ^ Math.abs(userId.getMostSignificantBits());
        int index = (int) (Math.abs(seed) % pool.size());

        Route daily = pool.get(index);
        log.debug("Маршрут дня для userId={}: routeId={} (index={}/{})",
                userId, daily.getId(), index, pool.size());

        return toShortResponse(daily);
    }

    // ==================== Персональные рекомендации ====================

    /**
     * Score-based персональные рекомендации.
     *
     * Score маршрута = tagMatchCount * {@value TAG_WEIGHT}
     *               + (маршрут не пройден ? {@value NOT_COMPLETED_BONUS} : 0)
     *               + min(completionsCount / {@value POPULARITY_DIVISOR}, {@value POPULARITY_CAP})
     *
     * Если у пользователя нет preferredTags, возвращаем просто популярные маршруты
     * (все с score > 0 по popularity-бонусу).
     *
     * Маршруты с score == 0 полностью исключаются, если у пользователя есть теги.
     *
     * Пагинация выполняется in-memory после вычисления скоров.
     * Для больших каталогов (>10k маршрутов) рекомендуется перенести расчёт в SQL.
     */
    @Override
    @Transactional(readOnly = true)
    public PageResponse<RouteShortResponse> getPersonalRecommendations(RecommendationFilter filter) {
        UUID userId = getCurrentUserId();

        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Профиль", userId));

        Set<UUID> preferredTags    = new HashSet<>(profile.getPreferredTagIds());
        Set<UUID> completedRouteIds = new HashSet<>(routeSessionRepository.findFinishedRouteIdsByUserId(userId));

        // Загружаем все активные маршруты, опционально отфильтрованные по RecommendationFilter
        List<Route> candidates = routeRepository.findAll(buildCandidateSpec(filter));

        boolean hasPreferredTags = !preferredTags.isEmpty();

        // Вычисляем score и фильтруем
        record ScoredRoute(Route route, long score) {}

        List<RouteShortResponse> ranked = candidates.stream()
                .map(route -> {
                    long tagMatch    = route.getTagIds().stream().filter(preferredTags::contains).count();
                    int  notCompleted = completedRouteIds.contains(route.getId()) ? 0 : NOT_COMPLETED_BONUS;
                    int  popularity  = Math.min(route.getCompletionsCount() / POPULARITY_DIVISOR, POPULARITY_CAP);
                    long score       = tagMatch * TAG_WEIGHT + notCompleted + popularity;
                    return new ScoredRoute(route, score);
                })
                // Если у пользователя есть теги — показываем только маршруты с ненулевым score
                .filter(sr -> !hasPreferredTags || sr.score() > 0)
                .sorted(Comparator.comparingLong(ScoredRoute::score).reversed())
                .map(sr -> toShortResponse(sr.route()))
                .toList();

        // In-memory пагинация
        long totalElements = ranked.size();
        int  totalPages    = filter.getSize() > 0
                ? (int) Math.ceil((double) totalElements / filter.getSize())
                : 1;

        int fromIndex = filter.getPage() * filter.getSize();
        int toIndex   = Math.min(fromIndex + filter.getSize(), ranked.size());

        List<RouteShortResponse> page = fromIndex >= ranked.size()
                ? List.of()
                : ranked.subList(fromIndex, toIndex);

        log.debug("Рекомендации для userId={}: всего={}, страница={}/{}",
                userId, totalElements, filter.getPage(), totalPages);

        return new PageResponse<>(page, totalElements, totalPages, filter.getPage());
    }

    // ==================== Вспомогательные методы ====================

    private UUID getCurrentUserId() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    /**
     * Specification для кандидатов рекомендаций: активные + опциональные фильтры из {@link RecommendationFilter}.
     */
    private Specification<Route> buildCandidateSpec(RecommendationFilter filter) {
        return (root, query, cb) -> {
            var predicates = new ArrayList<>();

            predicates.add(cb.isTrue(root.get("isActive")));

            if (filter.getType() != null && !filter.getType().isBlank()) {
                try {
                    RouteType type = RouteType.valueOf(filter.getType().toUpperCase());
                    predicates.add(cb.equal(root.get("type"), type));
                } catch (IllegalArgumentException ignored) {}
            }

            if (filter.getDifficultyMin() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("difficulty"), filter.getDifficultyMin()));
            }
            if (filter.getDifficultyMax() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("difficulty"), filter.getDifficultyMax()));
            }
            if (filter.getCity() != null && !filter.getCity().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("city")),
                        "%" + filter.getCity().toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    private RouteShortResponse toShortResponse(Route route) {
        return RouteShortResponse.builder()
                .id(route.getId())
                .title(route.getTitle())
                .description(route.getDescription())
                .type(route.getType().name())
                .difficulty(route.getDifficulty())
                .lengthMeters(route.getLengthMeters())
                .estimatedTimeMinutes(route.getEstimatedTimeMinutes())
                .city(route.getCity())
                .completionsCount(route.getCompletionsCount())
                .isActive(route.getIsActive())
                .images(buildImageResponses(route.getImageFileIds()))
                .tags(buildTagResponses(route.getTagIds()))
                .build();
    }

    private List<TagResponse> buildTagResponses(List<UUID> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) return List.of();
        return tagRepository.findAllByIdIn(tagIds).stream()
                .map(tag -> TagResponse.builder()
                        .id(tag.getId())
                        .title(tag.getTitle())
                        .build())
                .toList();
    }

    private List<MediaFileResponse> buildImageResponses(List<UUID> fileIds) {
        if (fileIds == null || fileIds.isEmpty()) return List.of();
        return fileIds.stream()
                .map(id -> mediaFileRepository.findById(id)
                        .map(file -> MediaFileResponse.builder()
                                .id(file.getId())
                                .filename(file.getOriginalFilename())
                                .contentType(file.getContentType())
                                .createTs(file.getCreatedAt())
                                .sortOrder(file.getSortOrder())
                                .build())
                        .orElse(null))
                .filter(Objects::nonNull)
                .toList();
    }
}

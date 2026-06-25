package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.session.RouteSessionStatus;
import ru.ngtu.v1.routie.dto.statistics.*;
import ru.ngtu.v1.routie.model.Achievement;
import ru.ngtu.v1.routie.model.Route;
import ru.ngtu.v1.routie.model.RouteSession;
import ru.ngtu.v1.routie.model.User;
import ru.ngtu.v1.routie.model.UserProfile;
import ru.ngtu.v1.routie.repository.*;
import ru.ngtu.v1.routie.repository.projection.AchievementUnlockCount;
import ru.ngtu.v1.routie.repository.projection.LevelCount;
import ru.ngtu.v1.routie.repository.projection.RoutePopularityCount;
import ru.ngtu.v1.routie.repository.projection.UserActivityAggregate;
import ru.ngtu.v1.routie.service.StatisticsService;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {

    private final RouteSessionRepository routeSessionRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final RouteRepository routeRepository;
    private final XpTransactionRepository xpTransactionRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final AchievementRepository achievementRepository;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public StatisticsOverviewResponse getOverview(LocalDate startDate, LocalDate endDate) {
        Instant since = resolveSince(startDate);
        Instant until = resolveUntil(endDate);

        long totalUsers = userRepository.count();

        Instant last30DaysSince = Instant.now().minus(30, ChronoUnit.DAYS);
        long activeUsersLast30Days = routeSessionRepository
                .countDistinctUsersBetween(last30DaysSince, Instant.now());

        long totalRoutesCompleted = routeSessionRepository.countFinishedBetween(since, until);
        long totalDistanceMeters = routeSessionRepository.sumDistanceMetersFinishedBetween(since, until);
        long totalXpEarned = xpTransactionRepository.sumAmountBetween(since, until);
        Double averageLevel = userProfileRepository.averageCurrentLevel();

        return StatisticsOverviewResponse.builder()
                .totalUsers((int) totalUsers)
                .activeUsersLast30Days((int) activeUsersLast30Days)
                .totalRoutesCompleted((int) totalRoutesCompleted)
                .totalDistanceMeters(totalDistanceMeters)
                .totalXpEarned(totalXpEarned)
                .averageLevel(averageLevel != null ? averageLevel.floatValue() : 0f)
                .build();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public PageResponse<UserActivityResponse> getUsersActivity(
            LocalDate startDate, LocalDate endDate, int page, int size) {
        Instant since = resolveSince(startDate);
        Instant until = resolveUntil(endDate);

        Page<UserActivityAggregate> aggregates = routeSessionRepository
                .findUserActivityBetween(since, until, PageRequest.of(page, size));

        Set<UUID> userIds = aggregates.getContent().stream()
                .map(UserActivityAggregate::getUserId)
                .collect(Collectors.toSet());

        Map<UUID, User> usersById = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));
        Map<UUID, UserProfile> profilesById = userProfileRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserProfile::getUserId, Function.identity()));

        List<UserActivityResponse> content = aggregates.getContent().stream()
                .map(a -> {
                    User user = usersById.get(a.getUserId());
                    UserProfile profile = profilesById.get(a.getUserId());
                    return UserActivityResponse.builder()
                            .userId(a.getUserId())
                            .name(profile != null ? profile.getName() : null)
                            .username(user != null ? user.getUsername() : null)
                            .currentLevel(profile != null ? profile.getCurrentLevel() : null)
                            .totalXp(profile != null ? profile.getTotalXp() : null)
                            .routesCompleted(a.getRoutesCompleted() != null ? a.getRoutesCompleted().intValue() : 0)
                            .totalDistanceMeters(a.getTotalDistanceMeters() != null ? a.getTotalDistanceMeters().intValue() : 0)
                            .lastActivityDate(a.getLastActivityDate())
                            .build();
                })
                .toList();

        return new PageResponse<>(content, aggregates.getTotalElements(), aggregates.getTotalPages(), page);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public PopularRoutesResponse getPopularRoutes(LocalDate startDate, LocalDate endDate, int limit) {
        Instant since = resolveSince(startDate);
        Instant until = resolveUntil(endDate);

        List<RoutePopularityCount> counts = routeSessionRepository
                .findPopularRouteIds(since, until, PageRequest.of(0, limit));

        List<UUID> routeIds = counts.stream().map(RoutePopularityCount::getRouteId).toList();
        Map<UUID, Route> routesById = routeRepository.findAllById(routeIds).stream()
                .collect(Collectors.toMap(Route::getId, Function.identity()));

        List<PopularRouteResponse> routes = counts.stream()
                .map(c -> {
                    Route route = routesById.get(c.getRouteId());
                    return PopularRouteResponse.builder()
                            .routeId(c.getRouteId())
                            .title(route != null ? route.getTitle() : null)
                            .type(route != null ? route.getType().name() : null)
                            .completionsCount((int) c.getCnt())
                            .city(route != null ? route.getCity() : null)
                            .build();
                })
                .toList();

        return PopularRoutesResponse.builder().routes(routes).build();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public GamificationStatisticsResponse getGamificationStatistics(LocalDate startDate, LocalDate endDate) {
        Instant since = resolveSince(startDate);
        Instant until = resolveUntil(endDate);

        long totalXpDistributed = xpTransactionRepository.sumAmountBetween(since, until);
        long totalUsers = userRepository.count();
        float averageXpPerUser = totalUsers > 0 ? (float) totalXpDistributed / totalUsers : 0f;

        List<AchievementUnlockCount> topUnlocked = userAchievementRepository
                .findMostUnlockedAchievements(PageRequest.of(0, 1));
        String topAchievement = null;
        if (!topUnlocked.isEmpty()) {
            topAchievement = achievementRepository.findById(topUnlocked.get(0).getAchievementId())
                    .map(Achievement::getTitle)
                    .orElse(null);
        }

        Map<Integer, Integer> usersByLevel = userProfileRepository.countUsersByLevel().stream()
                .collect(Collectors.toMap(LevelCount::getLevel, lc -> lc.getCnt().intValue()));

        return GamificationStatisticsResponse.builder()
                .totalXpDistributed(totalXpDistributed)
                .averageXpPerUser(averageXpPerUser)
                .topAchievement(topAchievement)
                .usersByLevel(usersByLevel)
                .build();
    }

    // ==================== Статистика по сессиям (ADMIN) ====================

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public PageResponse<SessionAdminResponse> getSessions(SessionAdminFilter filter) {
        Specification<RouteSession> spec = buildSessionSpec(
                filter.getUserId(), filter.getRouteId(),
                filter.getStatus(), filter.getStartDate(), filter.getEndDate()
        );

        PageRequest pageable = PageRequest.of(
                filter.getPage(), filter.getSize(),
                Sort.by("startedAt").descending()
        );

        Page<RouteSession> page = routeSessionRepository.findAll(spec, pageable);

        List<RouteSession> sessions = page.getContent();

        // Batch-загрузка связанных сущностей — один запрос на тип
        Set<UUID> userIds  = sessions.stream().map(RouteSession::getUserId).collect(Collectors.toSet());
        Set<UUID> routeIds = sessions.stream().map(RouteSession::getRouteId).collect(Collectors.toSet());

        Map<UUID, User>        usersById    = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));
        Map<UUID, UserProfile> profilesById = userProfileRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserProfile::getUserId, Function.identity()));
        Map<UUID, Route>       routesById   = routeRepository.findAllById(routeIds).stream()
                .collect(Collectors.toMap(Route::getId, Function.identity()));

        List<SessionAdminResponse> content = sessions.stream()
                .map(s -> {
                    User        user    = usersById.get(s.getUserId());
                    UserProfile profile = profilesById.get(s.getUserId());
                    Route       route   = routesById.get(s.getRouteId());
                    return SessionAdminResponse.builder()
                            .id(s.getId())
                            .userId(s.getUserId())
                            .username(user != null ? user.getUsername() : null)
                            .userDisplayName(profile != null ? profile.getName() : null)
                            .routeId(s.getRouteId())
                            .routeTitle(route != null ? route.getTitle() : null)
                            .status(s.getStatus())
                            .startedAt(s.getStartedAt())
                            .finishedAt(s.getFinishedAt())
                            .totalDurationSeconds(s.getTotalDurationSeconds())
                            .totalDistanceMeters(s.getTotalDistanceMeters())
                            .avgSpeedKmh(s.getAvgSpeedKmh())
                            .build();
                })
                .toList();

        return new PageResponse<>(content, page.getTotalElements(), page.getTotalPages(), filter.getPage());
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public SessionSummaryResponse getSessionsSummary(LocalDate startDate, LocalDate endDate, UUID routeId) {
        Specification<RouteSession> spec = buildSessionSpec(null, routeId, null, startDate, endDate);
        List<RouteSession> sessions = routeSessionRepository.findAll(spec);

        long total    = sessions.size();
        long finished = sessions.stream().filter(s -> s.getStatus() == RouteSessionStatus.FINISHED).count();
        long aborted  = sessions.stream().filter(s -> s.getStatus() == RouteSessionStatus.ABORTED).count();
        long active   = sessions.stream().filter(s -> s.getStatus() == RouteSessionStatus.ACTIVE).count();

        long concluded = finished + aborted;
        Double completionRate = concluded > 0 ? (double) finished / concluded * 100.0 : null;

        OptionalDouble avgDuration = sessions.stream()
                .filter(s -> s.getTotalDurationSeconds() != null)
                .mapToLong(RouteSession::getTotalDurationSeconds)
                .average();

        OptionalDouble avgSpeed = sessions.stream()
                .filter(s -> s.getAvgSpeedKmh() != null)
                .mapToDouble(RouteSession::getAvgSpeedKmh)
                .average();

        OptionalDouble avgDistance = sessions.stream()
                .filter(s -> s.getTotalDistanceMeters() != null)
                .mapToInt(RouteSession::getTotalDistanceMeters)
                .average();

        return SessionSummaryResponse.builder()
                .totalSessions(total)
                .finishedCount(finished)
                .abortedCount(aborted)
                .activeCount(active)
                .completionRate(completionRate)
                .avgDurationSeconds(avgDuration.isPresent() ? avgDuration.getAsDouble() : null)
                .avgSpeedKmh(avgSpeed.isPresent() ? avgSpeed.getAsDouble() : null)
                .avgDistanceMeters(avgDistance.isPresent() ? avgDistance.getAsDouble() : null)
                .build();
    }

    // ==================== Вспомогательные методы ====================

    /** Нижняя граница диапазона: начало startDate либо вся история, если дата не передана. */
    private Instant resolveSince(LocalDate startDate) {
        return startDate != null ? startDate.atStartOfDay(ZoneOffset.UTC).toInstant() : Instant.EPOCH;
    }

    /** Верхняя граница диапазона: конец endDate (исключительно) либо текущий момент, если дата не передана. */
    private Instant resolveUntil(LocalDate endDate) {
        return endDate != null ? endDate.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant() : Instant.now();
    }

    private Specification<RouteSession> buildSessionSpec(
            UUID userId, UUID routeId, RouteSessionStatus status,
            LocalDate startDate, LocalDate endDate
    ) {
        return (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            if (userId != null) {
                predicates.add(cb.equal(root.get("userId"), userId));
            }
            if (routeId != null) {
                predicates.add(cb.equal(root.get("routeId"), routeId));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (startDate != null) {
                Instant from = startDate.atStartOfDay(ZoneOffset.UTC).toInstant();
                predicates.add(cb.greaterThanOrEqualTo(root.get("startedAt"), from));
            }
            if (endDate != null) {
                Instant to = endDate.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
                predicates.add(cb.lessThan(root.get("startedAt"), to));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
}

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
import ru.ngtu.v1.routie.model.Route;
import ru.ngtu.v1.routie.model.RouteSession;
import ru.ngtu.v1.routie.model.User;
import ru.ngtu.v1.routie.model.UserProfile;
import ru.ngtu.v1.routie.repository.*;
import ru.ngtu.v1.routie.service.StatisticsService;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
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

    @Override
    public StatisticsOverviewResponse getOverview(LocalDate startDate, LocalDate endDate) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public PageResponse<UserActivityResponse> getUsersActivity(
            LocalDate startDate, LocalDate endDate, int page, int size) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public PopularRoutesResponse getPopularRoutes(LocalDate startDate, LocalDate endDate, int limit) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public GamificationStatisticsResponse getGamificationStatistics(LocalDate startDate, LocalDate endDate) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
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

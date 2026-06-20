package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.v1.routie.dto.session.RouteSessionStatus;
import ru.ngtu.v1.routie.dto.session.request.FinishSessionRequest;
import ru.ngtu.v1.routie.dto.session.request.ReachCheckpointRequest;
import ru.ngtu.v1.routie.dto.session.request.StartSessionRequest;
import ru.ngtu.v1.routie.dto.session.response.CheckpointProgressResponse;
import ru.ngtu.v1.routie.dto.session.response.RouteSessionResponse;
import ru.ngtu.v1.routie.exception.BadRequestException;
import ru.ngtu.v1.routie.exception.ConflictException;
import ru.ngtu.v1.routie.exception.EntityNotFoundException;
import ru.ngtu.v1.routie.exception.ForbiddenException;
import ru.ngtu.v1.routie.model.*;
import ru.ngtu.v1.routie.repository.*;
import ru.ngtu.v1.routie.security.CustomUserDetails;
import ru.ngtu.v1.routie.service.RouteSessionService;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RouteSessionServiceImpl implements RouteSessionService {

    private final RouteSessionRepository routeSessionRepository;
    private final CheckpointProgressRepository checkpointProgressRepository;
    private final CheckpointRepository checkpointRepository;
    private final RouteRepository routeRepository;
    private final UserProfileRepository userProfileRepository;

    // ==================== Начало сессии ====================

    @Override
    @Transactional
    public RouteSessionResponse startSession(StartSessionRequest request) {
        UUID userId = getCurrentUserId();

        // Один пользователь не может иметь более одной активной сессии
        if (routeSessionRepository.existsByUserIdAndStatus(userId, RouteSessionStatus.ACTIVE)) {
            throw new ConflictException("У вас уже есть активная сессия прохождения маршрута");
        }

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new EntityNotFoundException("Маршрут", request.getRouteId()));

        if (!route.getIsActive()) {
            throw new BadRequestException("Маршрут недоступен для прохождения");
        }

        RouteSession session = RouteSession.builder()
                .userId(userId)
                .routeId(route.getId())
                .status(RouteSessionStatus.ACTIVE)
                .build();

        session = routeSessionRepository.save(session);
        log.info("Начата сессия: sessionId={}, userId={}, routeId={}", session.getId(), userId, route.getId());
        return toResponse(session);
    }

    // ==================== Достижение чекпоинта ====================

    @Override
    @Transactional
    public RouteSessionResponse reachCheckpoint(ReachCheckpointRequest request) {
        UUID userId = getCurrentUserId();

        RouteSession session = findSessionById(request.getSessionId());
        validateOwnerAndActive(session, userId);

        // Загружаем чекпоинты маршрута в порядке sortOrder
        List<Checkpoint> routeCheckpoints =
                checkpointRepository.findAllByRoute_IdOrderBySortOrderAsc(session.getRouteId());

        // Проверяем, что запрошенный чекпоинт принадлежит этому маршруту
        Checkpoint target = routeCheckpoints.stream()
                .filter(cp -> cp.getId().equals(request.getCheckpointId()))
                .findFirst()
                .orElseThrow(() -> new BadRequestException(
                        "Чекпоинт не принадлежит маршруту данной сессии"));

        // Уже достигнутые в этой сессии
        Set<UUID> reachedIds = session.getCheckpointProgresses().stream()
                .map(CheckpointProgress::getCheckpointId)
                .collect(Collectors.toSet());

        if (reachedIds.contains(target.getId())) {
            // Идемпотентное обновление: перезаписываем время и скорость
            checkpointProgressRepository.findBySessionAndCheckpointId(session, target.getId())
                    .ifPresent(progress -> {
                        progress.setReachedAt(Instant.now());
                        progress.setAvgSpeedKmh(request.getAvgSpeedKmh());
                        checkpointProgressRepository.save(progress);
                    });
            log.debug("Идемпотентное обновление чекпоинта: sessionId={}, checkpointId={}",
                    session.getId(), target.getId());
        } else {
            // Строгий порядок: все предшествующие чекпоинты (по sortOrder) должны быть достигнуты
            for (Checkpoint cp : routeCheckpoints) {
                if (cp.getId().equals(target.getId())) break;
                if (!reachedIds.contains(cp.getId())) {
                    throw new BadRequestException(
                            "Нарушен порядок прохождения: сначала необходимо достичь чекпоинт с порядком "
                                    + cp.getSortOrder());
                }
            }

            CheckpointProgress progress = CheckpointProgress.builder()
                    .session(session)
                    .checkpointId(target.getId())
                    .reachedAt(Instant.now())
                    .avgSpeedKmh(request.getAvgSpeedKmh())
                    .build();

            checkpointProgressRepository.save(progress);
            session.getCheckpointProgresses().add(progress);

            log.info("Достигнут чекпоинт: sessionId={}, checkpointId={}, sortOrder={}",
                    session.getId(), target.getId(), target.getSortOrder());
        }

        return toResponse(session);
    }

    // ==================== Завершение сессии ====================

    @Override
    @Transactional
    public RouteSessionResponse finishSession(FinishSessionRequest request) {
        UUID userId = getCurrentUserId();

        RouteSession session = findSessionById(request.getSessionId());
        validateOwnerAndActive(session, userId);

        RouteSessionStatus newStatus = request.getStatus();
        if (newStatus == RouteSessionStatus.ACTIVE) {
            throw new BadRequestException("Нельзя завершить сессию со статусом ACTIVE");
        }

        Instant now = Instant.now();
        long durationSeconds = session.getStartedAt().until(now, ChronoUnit.SECONDS);

        // Средняя скорость = среднее по скоростям на всех участках
        OptionalDouble avgSpeedOpt = session.getCheckpointProgresses().stream()
                .filter(cp -> cp.getAvgSpeedKmh() != null)
                .mapToDouble(CheckpointProgress::getAvgSpeedKmh)
                .average();

        session.setStatus(newStatus);
        session.setFinishedAt(now);
        session.setTotalDurationSeconds(durationSeconds);
        session.setTotalDistanceMeters(request.getTotalDistanceMeters());
        session.setAvgSpeedKmh(avgSpeedOpt.isPresent() ? avgSpeedOpt.getAsDouble() : null);

        // ---- Обновление статистики ----
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Профиль", userId));

        // Дистанция учитывается и при FINISHED, и при ABORTED
        if (request.getTotalDistanceMeters() != null && request.getTotalDistanceMeters() > 0) {
            profile.setTotalDistanceMeters(
                    profile.getTotalDistanceMeters() + request.getTotalDistanceMeters());
        }

        if (newStatus == RouteSessionStatus.FINISHED) {
            // Счётчик завершений маршрута
            routeRepository.findById(session.getRouteId()).ifPresent(route -> {
                route.setCompletionsCount(route.getCompletionsCount() + 1);
                routeRepository.save(route);
            });

            profile.setTotalRoutesCompleted(profile.getTotalRoutesCompleted() + 1);

            // Новые уникальные ландмарки (не посещённые в предыдущих FINISHED-сессиях)
            int newLandmarks = countNewLandmarks(session, userId);
            profile.setTotalLandmarksVisited(profile.getTotalLandmarksVisited() + newLandmarks);

            log.info("Маршрут завершён: sessionId={}, userId={}, distance={}m, duration={}s, newLandmarks={}",
                    session.getId(), userId, request.getTotalDistanceMeters(), durationSeconds, newLandmarks);
        } else {
            log.info("Сессия прервана: sessionId={}, userId={}, distance={}m",
                    session.getId(), userId, request.getTotalDistanceMeters());
        }

        userProfileRepository.save(profile);
        session = routeSessionRepository.save(session);
        return toResponse(session);
    }

    // ==================== Вспомогательные методы ====================

    /**
     * Считает количество ландмарков из текущей сессии, которые пользователь
     * не посещал ни в одной предыдущей FINISHED-сессии.
     */
    private int countNewLandmarks(RouteSession currentSession, UUID userId) {
        Set<UUID> currentCheckpointIds = currentSession.getCheckpointProgresses().stream()
                .map(CheckpointProgress::getCheckpointId)
                .collect(Collectors.toSet());

        if (currentCheckpointIds.isEmpty()) return 0;

        // Загружаем чекпоинты текущей сессии вместе с ландмарками (одним запросом)
        Set<UUID> currentLandmarkIds = checkpointRepository
                .findAllByIdWithLandmark(currentCheckpointIds).stream()
                .filter(cp -> cp.getLandmark() != null)
                .map(cp -> cp.getLandmark().getId())
                .collect(Collectors.toSet());

        if (currentLandmarkIds.isEmpty()) return 0;

        // Собираем ландмарки из всех предыдущих FINISHED-сессий
        List<RouteSession> previousSessions = routeSessionRepository
                .findFinishedByUserIdExcludingSession(userId, currentSession.getId());

        Set<UUID> previousCheckpointIds = previousSessions.stream()
                .flatMap(s -> s.getCheckpointProgresses().stream())
                .map(CheckpointProgress::getCheckpointId)
                .collect(Collectors.toSet());

        Set<UUID> previousLandmarkIds = Collections.emptySet();
        if (!previousCheckpointIds.isEmpty()) {
            previousLandmarkIds = checkpointRepository
                    .findAllByIdWithLandmark(previousCheckpointIds).stream()
                    .filter(cp -> cp.getLandmark() != null)
                    .map(cp -> cp.getLandmark().getId())
                    .collect(Collectors.toSet());
        }

        currentLandmarkIds.removeAll(previousLandmarkIds);
        return currentLandmarkIds.size();
    }

    private void validateOwnerAndActive(RouteSession session, UUID userId) {
        if (!session.getUserId().equals(userId)) {
            throw new ForbiddenException("Сессия не принадлежит текущему пользователю");
        }
        if (session.getStatus() != RouteSessionStatus.ACTIVE) {
            throw new BadRequestException(
                    "Сессия не активна (текущий статус: " + session.getStatus() + ")");
        }
    }

    private RouteSession findSessionById(UUID sessionId) {
        return routeSessionRepository.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Сессия", sessionId));
    }

    private UUID getCurrentUserId() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    private RouteSessionResponse toResponse(RouteSession session) {
        List<CheckpointProgressResponse> checkpoints = session.getCheckpointProgresses().stream()
                .map(cp -> CheckpointProgressResponse.builder()
                        .checkpointId(cp.getCheckpointId())
                        .reachedAt(cp.getReachedAt())
                        .avgSpeedKmh(cp.getAvgSpeedKmh())
                        .build())
                .toList();

        return RouteSessionResponse.builder()
                .id(session.getId())
                .routeId(session.getRouteId())
                .userId(session.getUserId())
                .status(session.getStatus())
                .startedAt(session.getStartedAt())
                .finishedAt(session.getFinishedAt())
                .totalDurationSeconds(session.getTotalDurationSeconds())
                .totalDistanceMeters(session.getTotalDistanceMeters())
                .avgSpeedKmh(session.getAvgSpeedKmh())
                .checkpoints(checkpoints)
                .build();
    }
}

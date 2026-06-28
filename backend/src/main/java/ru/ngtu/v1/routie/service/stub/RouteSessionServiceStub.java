package ru.ngtu.v1.routie.service.stub;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.session.RouteSessionStatus;
import ru.ngtu.v1.routie.dto.session.request.AbortActiveSessionRequest;
import ru.ngtu.v1.routie.dto.session.request.FinishSessionRequest;
import ru.ngtu.v1.routie.dto.session.request.ReachCheckpointRequest;
import ru.ngtu.v1.routie.dto.session.request.StartSessionRequest;
import ru.ngtu.v1.routie.dto.session.response.CheckpointProgressResponse;
import ru.ngtu.v1.routie.dto.session.response.RouteSessionResponse;
import ru.ngtu.v1.routie.service.RouteSessionService;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@Profile("stub-route-session")
@Primary
public class RouteSessionServiceStub implements RouteSessionService {

    @Override
    public RouteSessionResponse startSession(StartSessionRequest request) {
        log.debug("[STUB] startSession routeId={}", request.getRouteId());
        return FakeDataFactory.fakeRouteSession(
                request.getRouteId(),
                UUID.randomUUID(),
                RouteSessionStatus.ACTIVE
        );
    }

    @Override
    public RouteSessionResponse reachCheckpoint(ReachCheckpointRequest request) {
        log.debug("[STUB] reachCheckpoint sessionId={}, checkpointId={}",
                request.getSessionId(), request.getCheckpointId());

        RouteSessionResponse session = FakeDataFactory.fakeRouteSession(
                UUID.randomUUID(),
                UUID.randomUUID(),
                RouteSessionStatus.ACTIVE
        );
        session.setId(request.getSessionId());

        // Добавляем достигнутый чекпоинт в начало списка
        CheckpointProgressResponse reached = new CheckpointProgressResponse(
                request.getCheckpointId(),
                Instant.now(),
                request.getAvgSpeedKmh() != null ? request.getAvgSpeedKmh() : 5.0
        );
        List<CheckpointProgressResponse> checkpoints = new ArrayList<>(session.getCheckpoints());
        checkpoints.add(0, reached);
        session.setCheckpoints(checkpoints);

        return session;
    }

    @Override
    public RouteSessionResponse finishSession(FinishSessionRequest request) {
        log.debug("[STUB] finishSession sessionId={}, status={}", request.getSessionId(), request.getStatus());

        RouteSessionResponse session = FakeDataFactory.fakeRouteSession(
                UUID.randomUUID(),
                UUID.randomUUID(),
                request.getStatus()
        );
        session.setId(request.getSessionId());

        if (request.getTotalDistanceMeters() != null) {
            session.setTotalDistanceMeters(request.getTotalDistanceMeters());
        }

        return session;
    }

    @Override
    public RouteSessionResponse getActiveSession() {
        log.debug("[STUB] getActiveSession");
        return FakeDataFactory.fakeRouteSession(
                UUID.randomUUID(), UUID.randomUUID(), RouteSessionStatus.ACTIVE);
    }

    @Override
    public void abortActiveSession(AbortActiveSessionRequest request) {
        log.debug("[STUB] abortActiveSession totalDistanceMeters={}", request.getTotalDistanceMeters());
    }

    @Override
    public PageResponse<RouteSessionResponse> getSessionHistory(
            RouteSessionStatus status, UUID routeId, int page, int size) {
        log.debug("[STUB] getSessionHistory status={}, routeId={}, page={}, size={}",
                status, routeId, page, size);
        long total = 58L;
        List<RouteSessionResponse> content = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            content.add(FakeDataFactory.fakeRouteSession(
                    routeId != null ? routeId : UUID.randomUUID(),
                    UUID.randomUUID(),
                    status != null ? status : RouteSessionStatus.FINISHED));
        }
        return FakeDataFactory.fakePage(content, page, size, total);
    }
}

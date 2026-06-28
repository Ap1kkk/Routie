package ru.ngtu.v1.routie.service;

import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.session.RouteSessionStatus;
import ru.ngtu.v1.routie.dto.session.request.AbortActiveSessionRequest;
import ru.ngtu.v1.routie.dto.session.request.FinishSessionRequest;
import ru.ngtu.v1.routie.dto.session.request.ReachCheckpointRequest;
import ru.ngtu.v1.routie.dto.session.request.StartSessionRequest;
import ru.ngtu.v1.routie.dto.session.response.RouteSessionResponse;

import java.util.UUID;

public interface RouteSessionService {

    RouteSessionResponse startSession(StartSessionRequest request);

    RouteSessionResponse reachCheckpoint(ReachCheckpointRequest request);

    RouteSessionResponse finishSession(FinishSessionRequest request);

    /** Активная сессия текущего пользователя (null, если нет активной). */
    RouteSessionResponse getActiveSession();

    /**
     * Прерывает активную сессию текущего пользователя (статус ABORTED).
     * Если активной сессии нет — ничего не делает.
     */
    void abortActiveSession(AbortActiveSessionRequest request);

    /** История сессий текущего пользователя с пагинацией и опциональной фильтрацией. */
    PageResponse<RouteSessionResponse> getSessionHistory(
            RouteSessionStatus status, UUID routeId, int page, int size);
}

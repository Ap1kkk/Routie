package ru.ngtu.v1.routie.service;

import ru.ngtu.v1.routie.dto.session.request.FinishSessionRequest;
import ru.ngtu.v1.routie.dto.session.request.ReachCheckpointRequest;
import ru.ngtu.v1.routie.dto.session.request.StartSessionRequest;
import ru.ngtu.v1.routie.dto.session.response.RouteSessionResponse;

public interface RouteSessionService {

    RouteSessionResponse startSession(StartSessionRequest request);

    RouteSessionResponse reachCheckpoint(ReachCheckpointRequest request);

    RouteSessionResponse finishSession(FinishSessionRequest request);
}

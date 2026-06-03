package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ngtu.v1.routie.dto.session.request.FinishSessionRequest;
import ru.ngtu.v1.routie.dto.session.request.ReachCheckpointRequest;
import ru.ngtu.v1.routie.dto.session.request.StartSessionRequest;
import ru.ngtu.v1.routie.dto.session.response.RouteSessionResponse;
import ru.ngtu.v1.routie.service.RouteSessionService;

@Service
@RequiredArgsConstructor
public class RouteSessionServiceImpl implements RouteSessionService {

    @Override
    public RouteSessionResponse startSession(StartSessionRequest request) {
        // TODO: implement
        // - Проверить, что у текущего пользователя нет ACTIVE-сессии
        // - Создать новую сессию со статусом ACTIVE и startedAt = now()
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public RouteSessionResponse reachCheckpoint(ReachCheckpointRequest request) {
        // TODO: implement
        // - Найти сессию по sessionId, проверить что она ACTIVE и принадлежит текущему пользователю
        // - Проверить, что checkpointId принадлежит маршруту сессии
        // - Добавить запись о достижении чекпоинта с reachedAt = now() и avgSpeedKmh
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public RouteSessionResponse finishSession(FinishSessionRequest request) {
        // TODO: implement
        // - Найти сессию по sessionId, проверить что она ACTIVE и принадлежит текущему пользователю
        // - Установить status = request.status, finishedAt = now()
        // - Сохранить totalDistanceMeters от клиента
        // - Вычислить totalDurationSeconds = finishedAt - startedAt
        // - Вычислить avgSpeedKmh как среднее по скоростям чекпоинтов
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

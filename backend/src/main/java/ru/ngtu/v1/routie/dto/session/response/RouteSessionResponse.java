package ru.ngtu.v1.routie.dto.session.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.v1.routie.dto.session.RouteSessionStatus;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteSessionResponse {

    private UUID id;
    private UUID routeId;
    private UUID userId;
    private RouteSessionStatus status;

    private Instant startedAt;
    private Instant finishedAt;

    /** Вычисляется на бэке: finishedAt - startedAt */
    private Long totalDurationSeconds;

    /** Передаётся клиентом при завершении маршрута */
    private Integer totalDistanceMeters;

    /** Вычисляется на бэке как среднее из скоростей чекпоинтов */
    private Double avgSpeedKmh;

    private List<CheckpointProgressResponse> checkpoints;
}

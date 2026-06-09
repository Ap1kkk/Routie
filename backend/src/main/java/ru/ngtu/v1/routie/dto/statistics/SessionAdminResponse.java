package ru.ngtu.v1.routie.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.v1.routie.dto.session.RouteSessionStatus;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionAdminResponse {

    private UUID id;

    // Пользователь
    private UUID userId;
    private String username;
    private String userDisplayName;

    // Маршрут
    private UUID routeId;
    private String routeTitle;

    private RouteSessionStatus status;

    private Instant startedAt;
    private Instant finishedAt;
    private Long totalDurationSeconds;
    private Integer totalDistanceMeters;
    private Double avgSpeedKmh;
}

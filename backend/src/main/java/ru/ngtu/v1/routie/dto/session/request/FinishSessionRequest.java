package ru.ngtu.v1.routie.dto.session.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import ru.ngtu.v1.routie.dto.session.RouteSessionStatus;

import java.util.UUID;

@Data
public class FinishSessionRequest {

    @NotNull
    private UUID sessionId;

    /** FINISHED или ABORTED */
    @NotNull
    private RouteSessionStatus status;

    /** Фактически пройденное расстояние по GPS, метры */
    @PositiveOrZero
    private Integer totalDistanceMeters;
}

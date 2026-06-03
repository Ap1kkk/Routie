package ru.ngtu.v1.routie.dto.session.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.util.UUID;

@Data
public class ReachCheckpointRequest {

    @NotNull
    private UUID sessionId;

    @NotNull
    private UUID checkpointId;

    /** Средняя скорость на участке от предыдущего чекпоинта, км/ч */
    @PositiveOrZero
    private Double avgSpeedKmh;
}

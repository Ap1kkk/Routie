package ru.ngtu.v1.routie.dto.session.request;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class AbortActiveSessionRequest {

    /** Фактически пройденное расстояние по GPS, метры (опционально) */
    @PositiveOrZero
    private Integer totalDistanceMeters;
}

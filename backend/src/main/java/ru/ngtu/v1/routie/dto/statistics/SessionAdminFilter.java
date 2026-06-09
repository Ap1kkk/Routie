package ru.ngtu.v1.routie.dto.statistics;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import ru.ngtu.v1.routie.dto.session.RouteSessionStatus;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class SessionAdminFilter {

    private UUID userId;

    private UUID routeId;

    private RouteSessionStatus status;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;

    @Min(0)
    private int page = 0;

    @Min(1)
    @Max(100)
    private int size = 20;
}

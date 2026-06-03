package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.statistics.GamificationStatisticsResponse;
import ru.ngtu.v1.routie.dto.statistics.PopularRoutesResponse;
import ru.ngtu.v1.routie.dto.statistics.StatisticsOverviewResponse;
import ru.ngtu.v1.routie.dto.statistics.UserActivityResponse;
import ru.ngtu.v1.routie.service.StatisticsService;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/statistics")
@RequiredArgsConstructor
@Validated
@Tag(name = "Statistics", description = "Статистика и аналитика приложения")
@SecurityRequirement(name = "bearerAuth")
public class StatisticsControllerV1 {

    private final StatisticsService statisticsService;

    @GetMapping("/overview")
    @Operation(summary = "Общая сводка по приложению (только ADMIN)")
    public ApiResponse<StatisticsOverviewResponse> getOverview(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ApiResponse.of(statisticsService.getOverview(startDate, endDate));
    }

    @GetMapping("/users/activity")
    @Operation(summary = "Активность пользователей")
    public ApiResponse<PageResponse<UserActivityResponse>> getUsersActivity(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size
    ) {
        return ApiResponse.of(statisticsService.getUsersActivity(startDate, endDate, page, size));
    }

    @GetMapping("/routes/popular")
    @Operation(summary = "Топ популярных маршрутов")
    public ApiResponse<PopularRoutesResponse> getPopularRoutes(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int limit
    ) {
        return ApiResponse.of(statisticsService.getPopularRoutes(startDate, endDate, limit));
    }

    @GetMapping("/gamification")
    @Operation(summary = "Статистика по геймификации")
    public ApiResponse<GamificationStatisticsResponse> getGamificationStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ApiResponse.of(statisticsService.getGamificationStatistics(startDate, endDate));
    }
}

package ru.ngtu.v1.routie.service;

import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.statistics.GamificationStatisticsResponse;
import ru.ngtu.v1.routie.dto.statistics.PopularRoutesResponse;
import ru.ngtu.v1.routie.dto.statistics.StatisticsOverviewResponse;
import ru.ngtu.v1.routie.dto.statistics.UserActivityResponse;

import java.time.LocalDate;

public interface StatisticsService {

    /**
     * Общая сводка по приложению (только ADMIN).
     */
    StatisticsOverviewResponse getOverview(LocalDate startDate, LocalDate endDate);

    /**
     * Активность пользователей с пагинацией.
     */
    PageResponse<UserActivityResponse> getUsersActivity(
            LocalDate startDate, LocalDate endDate, int page, int size);

    /**
     * Топ популярных маршрутов за период.
     */
    PopularRoutesResponse getPopularRoutes(LocalDate startDate, LocalDate endDate, int limit);

    /**
     * Статистика по геймификации за период.
     */
    GamificationStatisticsResponse getGamificationStatistics(LocalDate startDate, LocalDate endDate);
}

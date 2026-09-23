package ru.ngtu.v1.routie.service;

import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.statistics.*;

import java.time.LocalDate;
import java.util.UUID;

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

    /**
     * Список сессий с фильтрацией (только ADMIN).
     */
    PageResponse<SessionAdminResponse> getSessions(SessionAdminFilter filter);

    /**
     * Агрегированная сводка по сессиям за период (только ADMIN).
     */
    SessionSummaryResponse getSessionsSummary(LocalDate startDate, LocalDate endDate, UUID routeId);
}

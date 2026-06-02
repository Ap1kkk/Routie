package ru.ngtu.v1.routie.service;

import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.recommendation.RecommendationFilter;
import ru.ngtu.v1.routie.dto.route.response.RouteShortResponse;

public interface RecommendationService {

    /**
     * Получение персонального «Маршрута дня» для текущего пользователя.
     */
    RouteShortResponse getDailyRoute();

    /**
     * Персонализированные рекомендации маршрутов с поддержкой фильтрации и пагинации.
     */
    PageResponse<RouteShortResponse> getPersonalRecommendations(RecommendationFilter filter);
}

package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.recommendation.RecommendationFilter;
import ru.ngtu.v1.routie.dto.route.response.RouteShortResponse;
import ru.ngtu.v1.routie.service.RecommendationService;

@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
@Tag(name = "Recommendations", description = "Персонализированные рекомендации маршрутов")
@SecurityRequirement(name = "bearerAuth")
public class RecommendationControllerV1 {

    private final RecommendationService recommendationService;

    @GetMapping("/daily-route")
    @Operation(summary = "Получение персонального «Маршрута дня»")
    public ApiResponse<RouteShortResponse> getDailyRoute() {
        return ApiResponse.of(recommendationService.getDailyRoute());
    }

    @GetMapping("/personal")
    @Operation(summary = "Персонализированные рекомендации маршрутов")
    public ApiResponse<PageResponse<RouteShortResponse>> getPersonalRecommendations(
            @Valid @ModelAttribute @ParameterObject RecommendationFilter filter
    ) {
        return ApiResponse.of(recommendationService.getPersonalRecommendations(filter));
    }
}

package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.recommendation.RecommendationFilter;
import ru.ngtu.v1.routie.dto.route.response.RouteShortResponse;
import ru.ngtu.v1.routie.service.RecommendationService;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    @Override
    public RouteShortResponse getDailyRoute() {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public PageResponse<RouteShortResponse> getPersonalRecommendations(RecommendationFilter filter) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

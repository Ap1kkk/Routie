package ru.ngtu.v1.routie.service.stub;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.recommendation.RecommendationFilter;
import ru.ngtu.v1.routie.dto.route.response.RouteShortResponse;
import ru.ngtu.v1.routie.service.RecommendationService;

import java.util.List;

@Slf4j
@Service
@Profile("stub-recommendations")
@Primary
public class RecommendationServiceStub implements RecommendationService {

    @Override
    public RouteShortResponse getDailyRoute() {
        log.debug("[STUB] getDailyRoute");
        return FakeDataFactory.fakeRouteShort();
    }

    @Override
    public PageResponse<RouteShortResponse> getPersonalRecommendations(RecommendationFilter filter) {
        log.debug("[STUB] getPersonalRecommendations page={}, size={}", filter.getPage(), filter.getSize());
        long total = 48L;
        List<RouteShortResponse> content = FakeDataFactory.fakeRouteShortList(filter.getSize());
        return FakeDataFactory.fakePage(content, filter.getPage(), filter.getSize(), total);
    }
}

package ru.ngtu.v1.routie.service.stub;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.route.request.RouteCreateRequest;
import ru.ngtu.v1.routie.dto.route.request.RouteSearchFilter;
import ru.ngtu.v1.routie.dto.route.response.RouteFullResponse;
import ru.ngtu.v1.routie.dto.route.response.RouteShortResponse;
import ru.ngtu.v1.routie.service.RouteService;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@Profile("stub-route")
@Primary
public class RouteServiceStub implements RouteService {

    @Override
    public RouteShortResponse createRoute(RouteCreateRequest request) {
        log.debug("[STUB] createRoute: {}", request.getTitle());
        RouteShortResponse route = FakeDataFactory.fakeRouteShort();
        route.setTitle(request.getTitle() != null ? request.getTitle() : route.getTitle());
        return route;
    }

    @Override
    public RouteShortResponse updateRoute(UUID routeId, RouteCreateRequest request) {
        log.debug("[STUB] updateRoute: {}", routeId);
        RouteShortResponse route = FakeDataFactory.fakeRouteShort();
        route.setId(routeId);
        route.setTitle(request.getTitle() != null ? request.getTitle() : route.getTitle());
        return route;
    }

    @Override
    public void deleteRoute(UUID routeId) {
        log.debug("[STUB] deleteRoute: {}", routeId);
    }

    @Override
    public RouteShortResponse getRouteShort(UUID routeId) {
        log.debug("[STUB] getRouteShort: {}", routeId);
        RouteShortResponse route = FakeDataFactory.fakeRouteShort();
        route.setId(routeId);
        return route;
    }

    @Override
    public RouteFullResponse getRouteFull(UUID routeId) {
        log.debug("[STUB] getRouteFull: {}", routeId);
        RouteFullResponse route = FakeDataFactory.fakeRouteFull();
        route.setId(routeId);
        return route;
    }

    @Override
    public PageResponse<RouteShortResponse> searchRoutes(RouteSearchFilter filter) {
        log.debug("[STUB] searchRoutes page={}, size={}", filter.getPage(), filter.getSize());
        long total = 57L;
        List<RouteShortResponse> content = FakeDataFactory.fakeRouteShortList(filter.getSize());
        return FakeDataFactory.fakePage(content, filter.getPage(), filter.getSize(), total);
    }

    @Override
    public PageResponse<RouteShortResponse> getRecommendedRoutes(int page, int size) {
        log.debug("[STUB] getRecommendedRoutes page={}, size={}", page, size);
        long total = 20L;
        List<RouteShortResponse> content = FakeDataFactory.fakeRouteShortList(Math.min(size, (int) total));
        return FakeDataFactory.fakePage(content, page, size, total);
    }

    @Override
    public void publishRoute(UUID routeId) {
        log.debug("[STUB] publishRoute: {}", routeId);
    }

    @Override
    public List<MediaFileResponse> uploadImages(UUID routeId, List<MultipartFile> files) {
        log.debug("[STUB] uploadImages routeId={}, count={}", routeId, files.size());
        return FakeDataFactory.fakeMediaFiles(files.size());
    }
}

package ru.ngtu.v1.routie.service.impl;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.route.request.RouteCreateRequest;
import ru.ngtu.v1.routie.dto.route.response.RouteFullResponse;
import ru.ngtu.v1.routie.dto.route.response.RouteShortResponse;
import ru.ngtu.v1.routie.dto.route.request.RouteSearchFilter;
import ru.ngtu.v1.routie.service.RouteService;

@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {

  @Override
  public RouteShortResponse createRoute(RouteCreateRequest request) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public RouteShortResponse updateRoute(UUID routeId, RouteCreateRequest request) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public void deleteRoute(UUID routeId) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public RouteShortResponse getRouteShort(UUID routeId) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public RouteFullResponse getRouteFull(UUID routeId) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public PageResponse<RouteShortResponse> searchRoutes(RouteSearchFilter filter) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public PageResponse<RouteShortResponse> getRecommendedRoutes(int page, int size) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public void publishRoute(UUID routeId) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public List<MediaFileResponse> uploadImages(UUID routeId, List<MultipartFile> files) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }
}

package ru.ngtu.v1.routie.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.route.request.RouteCreateRequest;
import ru.ngtu.v1.routie.dto.route.response.RouteFullResponse;
import ru.ngtu.v1.routie.dto.route.response.RouteShortResponse;
import ru.ngtu.v1.routie.dto.route.request.RouteSearchFilter;

public interface RouteService {

  RouteShortResponse createRoute(RouteCreateRequest request);

  RouteShortResponse updateRoute(UUID routeId, RouteCreateRequest request);

  void deleteRoute(UUID routeId);

  RouteShortResponse getRouteShort(UUID routeId);

  RouteFullResponse getRouteFull(UUID routeId);

  PageResponse<RouteShortResponse> searchRoutes(RouteSearchFilter filter);

  void publishRoute(UUID routeId);

  List<MediaFileResponse> uploadImages(UUID routeId, List<MultipartFile> files);

  /**
   * Популярные маршруты по кол-ву завершений.
   * Если startDate/endDate не переданы — учитывается весь общий счётчик {@code completionsCount}.
   * Если переданы — считается кол-во FINISHED-сессий в этом диапазоне (включительно).
   */
  List<RouteShortResponse> getPopularRoutes(LocalDate startDate, LocalDate endDate, int limit);

  // ==================== Избранное ====================

  PageResponse<RouteShortResponse> getFavorites(int page, int size);

  void addFavorite(UUID routeId);

  void removeFavorite(UUID routeId);
}

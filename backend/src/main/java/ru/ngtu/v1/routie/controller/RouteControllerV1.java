package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.ApiResponseVoid;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.route.request.RouteCreateRequest;
import ru.ngtu.v1.routie.dto.route.response.RouteFullResponse;
import ru.ngtu.v1.routie.dto.route.response.RouteShortResponse;
import ru.ngtu.v1.routie.dto.route.request.RouteSearchFilter;
import ru.ngtu.v1.routie.service.RouteService;

@RestController
@RequestMapping("/api/v1/routes")
@RequiredArgsConstructor
@Validated
@Tag(name = "Routes", description = "Управление маршрутами")
public class RouteControllerV1 {

  private final RouteService routeService;

  @GetMapping
  @Operation(summary = "Поиск и фильтрация маршрутов")
  public ApiResponse<PageResponse<RouteShortResponse>> searchRoutes(
      @Valid @ModelAttribute @ParameterObject RouteSearchFilter filter
  ) {
    return ApiResponse.of(routeService.searchRoutes(filter));
  }

  @GetMapping("/popular")
  @Operation(summary = "Популярные маршруты по кол-ву завершений. " +
      "Если startDate/endDate не переданы — за всё время, иначе — за указанный диапазон")
  public ApiResponse<List<RouteShortResponse>> getPopularRoutes(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
      @RequestParam(defaultValue = "10") @Min(1) @Max(50) int limit
  ) {
    return ApiResponse.of(routeService.getPopularRoutes(startDate, endDate, limit));
  }

  // ==================== Избранное ====================

  @GetMapping("/favorites")
  @Operation(summary = "Список избранных маршрутов текущего пользователя")
  public ApiResponse<PageResponse<RouteShortResponse>> getFavorites(
      @RequestParam(defaultValue = "0") @Min(0) int page,
      @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size
  ) {
    return ApiResponse.of(routeService.getFavorites(page, size));
  }

  @PostMapping("/{routeId}/favorite")
  @Operation(summary = "Добавление маршрута в избранное")
  public ApiResponseVoid addFavorite(@PathVariable UUID routeId) {
    routeService.addFavorite(routeId);
    return ApiResponse.empty();
  }

  @DeleteMapping("/{routeId}/favorite")
  @Operation(summary = "Удаление маршрута из избранного")
  public ApiResponseVoid removeFavorite(@PathVariable UUID routeId) {
    routeService.removeFavorite(routeId);
    return ApiResponse.empty();
  }

  @GetMapping("/{routeId}")
  @Operation(summary = "Получение краткой информации о маршруте")
  public ApiResponse<RouteShortResponse> getRouteShort(@PathVariable UUID routeId) {
    return ApiResponse.of(routeService.getRouteShort(routeId));
  }

  @GetMapping("/{routeId}/full")
  @Operation(summary = "Получение полной информации о маршруте")
  public ApiResponse<RouteFullResponse> getRouteFull(@PathVariable UUID routeId) {
    return ApiResponse.of(routeService.getRouteFull(routeId));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Создание нового маршрута (только ADMIN)")
  public ApiResponse<RouteShortResponse> createRoute(@Valid @RequestBody RouteCreateRequest request) {
    return ApiResponse.of(routeService.createRoute(request));
  }

  @PutMapping("/{routeId}")
  @Operation(summary = "Обновление маршрута (только ADMIN)")
  public ApiResponse<RouteShortResponse> updateRoute(
      @PathVariable UUID routeId,
      @Valid @RequestBody RouteCreateRequest request
  ) {
    return ApiResponse.of(routeService.updateRoute(routeId, request));
  }

  @DeleteMapping("/{routeId}")
  @Operation(summary = "Удаление маршрута (только ADMIN)")
  public ApiResponseVoid deleteRoute(@PathVariable UUID routeId) {
    routeService.deleteRoute(routeId);
    return ApiResponse.empty();
  }

  @PatchMapping("/{routeId}/publish")
  @Operation(summary = "Публикация маршрута (только ADMIN)")
  public ApiResponseVoid publishRoute(@PathVariable UUID routeId) {
    routeService.publishRoute(routeId);
    return ApiResponse.empty();
  }

  @PatchMapping(value = "/{routeId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Загрузка изображений для маршрута (только ADMIN)")
  public ApiResponse<List<MediaFileResponse>> uploadImages(
      @PathVariable UUID routeId,
      @RequestPart("files") List<MultipartFile> files
  ) {
    return ApiResponse.of(routeService.uploadImages(routeId, files));
  }
}

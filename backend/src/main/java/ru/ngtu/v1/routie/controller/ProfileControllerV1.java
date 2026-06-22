package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.profile.ProfileUpdateRequest;
import ru.ngtu.v1.routie.dto.profile.UserProfileFullResponse;
import ru.ngtu.v1.routie.dto.profile.UserProfileShortResponse;
import ru.ngtu.v1.routie.dto.profile.UserStatisticsResponse;
import ru.ngtu.v1.routie.dto.route.response.RouteShortResponse;
import ru.ngtu.v1.routie.service.ProfileService;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@Tag(name = "Profile", description = "Управление профилями пользователей")
public class ProfileControllerV1 {

  private final ProfileService profileService;

  @GetMapping("/me")
  @Operation(summary = "Получение полного профиля текущего пользователя")
  public ApiResponse<UserProfileFullResponse> getCurrentUserProfile() {
    return ApiResponse.of(profileService.getCurrentUserProfile());
  }

  @GetMapping("/me/statistics")
  @Operation(summary = "Статистика текущего пользователя за диапазон дат (для экрана профиля). " +
      "Если startDate и endDate не переданы — статистика за всё время")
  public ApiResponse<UserStatisticsResponse> getCurrentUserStatistics(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
  ) {
    return ApiResponse.of(profileService.getCurrentUserStatistics(startDate, endDate));
  }

  @PutMapping("/me")
  @Operation(summary = "Обновление профиля текущего пользователя")
  public ApiResponse<UserProfileFullResponse> updateCurrentUserProfile(
      @RequestBody ProfileUpdateRequest request) {
    return ApiResponse.of(profileService.updateCurrentUserProfile(request));
  }

  @GetMapping("/{userId}")
  @Operation(summary = "Получение полного профиля другого пользователя")
  public ApiResponse<UserProfileFullResponse> getUserProfile(@PathVariable UUID userId) {
    return ApiResponse.of(profileService.getUserProfile(userId));
  }

  @GetMapping("/short/{userId}")
  @Operation(summary = "Получение краткого профиля пользователя")
  public ApiResponse<UserProfileShortResponse> getShortUserProfile(@PathVariable UUID userId) {
    return ApiResponse.of(profileService.getShortUserProfile(userId));
  }

  @PatchMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Загрузка или обновление аватарки")
  public ApiResponse<MediaFileResponse> uploadAvatar(@RequestPart("file") MultipartFile file) {
    return ApiResponse.of(profileService.uploadAvatar(file));
  }

  // ==================== Избранное ====================

  @GetMapping("/favorites")
  @Operation(summary = "Получение списка избранных маршрутов")
  public ApiResponse<PageResponse<RouteShortResponse>> getFavorites(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    return ApiResponse.of(profileService.getFavorites(page, size));
  }
}
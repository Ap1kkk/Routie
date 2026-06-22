package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.ApiResponseVoid;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.landmark.request.LandmarkCreateRequest;
import ru.ngtu.v1.routie.dto.landmark.request.LandmarkSearchFilter;
import ru.ngtu.v1.routie.dto.landmark.response.LandmarkResponse;
import ru.ngtu.v1.routie.service.LandmarkService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/landmarks")
@RequiredArgsConstructor
@Tag(name = "Landmarks", description = "Управление достопримечательностями")
public class LandmarkControllerV1 {

    private final LandmarkService landmarkService;

    @GetMapping
    @Operation(summary = "Поиск достопримечательностей по названию")
    public ApiResponse<PageResponse<LandmarkResponse>> searchLandmarks(
            @Valid @ModelAttribute @ParameterObject LandmarkSearchFilter filter
    ) {
        return ApiResponse.of(landmarkService.searchLandmarks(filter));
    }

    @GetMapping("/{landmarkId}")
    @Operation(summary = "Получение достопримечательности по ID")
    public ApiResponse<LandmarkResponse> getLandmark(@PathVariable UUID landmarkId) {
        return ApiResponse.of(landmarkService.getLandmark(landmarkId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Создание достопримечательности (только ADMIN)")
    public ApiResponse<LandmarkResponse> createLandmark(@Valid @RequestBody LandmarkCreateRequest request) {
        return ApiResponse.of(landmarkService.createLandmark(request));
    }

    @PutMapping("/{landmarkId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Обновление достопримечательности (только ADMIN)")
    public ApiResponse<LandmarkResponse> updateLandmark(
            @PathVariable UUID landmarkId,
            @Valid @RequestBody LandmarkCreateRequest request
    ) {
        return ApiResponse.of(landmarkService.updateLandmark(landmarkId, request));
    }

    @DeleteMapping("/{landmarkId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Удаление достопримечательности (только ADMIN)")
    public ApiResponseVoid deleteLandmark(@PathVariable UUID landmarkId) {
        landmarkService.deleteLandmark(landmarkId);
        return ApiResponse.empty();
    }

    @PatchMapping(value = "/{landmarkId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Загрузка изображений для достопримечательности (только ADMIN)")
    public ApiResponse<List<MediaFileResponse>> uploadImages(
            @PathVariable UUID landmarkId,
            @RequestPart("files") List<MultipartFile> files
    ) {
        return ApiResponse.of(landmarkService.uploadImages(landmarkId, files));
    }

    @DeleteMapping("/{landmarkId}/images")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Удаление всех изображений достопримечательности (только ADMIN). Сама сущность не удаляется")
    public ApiResponseVoid deleteAllImages(@PathVariable UUID landmarkId) {
        landmarkService.deleteAllImages(landmarkId);
        return ApiResponse.empty();
    }
}

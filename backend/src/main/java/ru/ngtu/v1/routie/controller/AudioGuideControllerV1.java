package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.RequestBody;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.audioguide.request.AudioGuideCreateRequest;
import ru.ngtu.v1.routie.dto.audioguide.request.AudioGuideSearchFilter;
import ru.ngtu.v1.routie.dto.audioguide.response.AudioGuideResponse;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.ApiResponseVoid;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.service.AudioGuideService;

@RestController
@RequestMapping("/api/v1/audio-guides")
@RequiredArgsConstructor
@Tag(name = "Audio Guides", description = "Управление аудиогидами")
public class AudioGuideControllerV1 {

    private final AudioGuideService audioGuideService;

    @GetMapping
    @Operation(summary = "Поиск аудиогидов по названию")
    public ApiResponse<PageResponse<AudioGuideResponse>> searchAudioGuides(
            @Valid @ModelAttribute @ParameterObject AudioGuideSearchFilter filter
    ) {
        return ApiResponse.of(audioGuideService.searchAudioGuides(filter));
    }

    @GetMapping("/{audioGuideId}")
    @Operation(summary = "Получение аудиогида по ID")
    public ApiResponse<AudioGuideResponse> getAudioGuide(@PathVariable UUID audioGuideId) {
        return ApiResponse.of(audioGuideService.getAudioGuide(audioGuideId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Создание аудиогида (только ADMIN)")
    public ApiResponse<AudioGuideResponse> createAudioGuide(@Valid @RequestBody AudioGuideCreateRequest request) {
        return ApiResponse.of(audioGuideService.createAudioGuide(request));
    }

    @PutMapping("/{audioGuideId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Обновление аудиогида (только ADMIN)")
    public ApiResponse<AudioGuideResponse> updateAudioGuide(
            @PathVariable UUID audioGuideId,
            @Valid @RequestBody AudioGuideCreateRequest request
    ) {
        return ApiResponse.of(audioGuideService.updateAudioGuide(audioGuideId, request));
    }

    @DeleteMapping("/{audioGuideId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Удаление аудиогида (только ADMIN)")
    public ApiResponseVoid deleteAudioGuide(@PathVariable UUID audioGuideId) {
        audioGuideService.deleteAudioGuide(audioGuideId);
        return ApiResponse.empty();
    }

    @PatchMapping(value = "/{audioGuideId}/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Загрузка аудиофайла для аудиогида (только ADMIN)")
    public ApiResponse<MediaFileResponse> uploadFile(
            @PathVariable UUID audioGuideId,
            @RequestPart("file") MultipartFile file
    ) {
        return ApiResponse.of(audioGuideService.uploadFile(audioGuideId, file));
    }
}

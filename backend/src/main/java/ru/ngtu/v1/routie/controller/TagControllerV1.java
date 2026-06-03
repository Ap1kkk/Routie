package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.ApiResponseVoid;
import ru.ngtu.v1.routie.dto.tag.TagCreateRequest;
import ru.ngtu.v1.routie.dto.tag.TagResponse;
import ru.ngtu.v1.routie.dto.tag.TagUpdateRequest;
import ru.ngtu.v1.routie.service.TagService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tags")
@RequiredArgsConstructor
@Tag(name = "Tags", description = "Управление тэгами маршрутов")
public class TagControllerV1 {

    private final TagService tagService;

    @GetMapping
    @Operation(summary = "Получение всех тэгов")
    public ApiResponse<List<TagResponse>> getAllTags() {
        return ApiResponse.of(tagService.getAllTags());
    }

    @GetMapping("/{tagId}")
    @Operation(summary = "Получение тэга по ID")
    public ApiResponse<TagResponse> getTagById(@PathVariable UUID tagId) {
        return ApiResponse.of(tagService.getTagById(tagId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Создание нового тэга (только ADMIN)")
    public ApiResponse<TagResponse> createTag(@Valid @RequestBody TagCreateRequest request) {
        return ApiResponse.of(tagService.createTag(request));
    }

    @PutMapping("/{tagId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Обновление тэга (только ADMIN)")
    public ApiResponse<TagResponse> updateTag(
            @PathVariable UUID tagId,
            @Valid @RequestBody TagUpdateRequest request
    ) {
        return ApiResponse.of(tagService.updateTag(tagId, request));
    }

    @DeleteMapping("/{tagId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Удаление тэга (только ADMIN)")
    public ApiResponseVoid deleteTag(@PathVariable UUID tagId) {
        tagService.deleteTag(tagId);
        return ApiResponse.empty();
    }
}

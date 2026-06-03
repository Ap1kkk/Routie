package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.ApiResponseVoid;
import ru.ngtu.v1.routie.dto.tag.TagCreateRequest;
import ru.ngtu.v1.routie.dto.tag.TagResponse;
import ru.ngtu.v1.routie.dto.tag.TagUpdateRequest;
import ru.ngtu.v1.routie.service.TagService;

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
  @Operation(summary = "Создание нового тэга (только ADMIN)")
  public ApiResponse<TagResponse> createTag(@Valid @RequestBody TagCreateRequest request) {
    return ApiResponse.of(tagService.createTag(request));
  }

  @PutMapping("/{tagId}")
  @Operation(summary = "Обновление тэга (только ADMIN)")
  public ApiResponse<TagResponse> updateTag(
      @PathVariable UUID tagId,
      @Valid @RequestBody TagUpdateRequest request
  ) {
    return ApiResponse.of(tagService.updateTag(tagId, request));
  }

  @DeleteMapping("/{tagId}")
  @Operation(summary = "Удаление тэга (только ADMIN)")
  public ApiResponseVoid deleteTag(@PathVariable UUID tagId) {
    tagService.deleteTag(tagId);
    return ApiResponse.empty();
  }
}

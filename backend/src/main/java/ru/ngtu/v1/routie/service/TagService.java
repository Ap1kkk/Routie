package ru.ngtu.v1.routie.service;

import java.util.List;
import java.util.UUID;
import ru.ngtu.v1.routie.dto.tag.TagCreateRequest;
import ru.ngtu.v1.routie.dto.tag.TagResponse;
import ru.ngtu.v1.routie.dto.tag.TagUpdateRequest;

public interface TagService {

  List<TagResponse> getAllTags();

  TagResponse getTagById(UUID tagId);

  TagResponse createTag(TagCreateRequest request);

  TagResponse updateTag(UUID tagId, TagUpdateRequest request);

  void deleteTag(UUID tagId);
}

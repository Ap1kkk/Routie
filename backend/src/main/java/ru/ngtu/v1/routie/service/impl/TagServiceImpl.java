package ru.ngtu.v1.routie.service.impl;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ngtu.v1.routie.dto.tag.TagCreateRequest;
import ru.ngtu.v1.routie.dto.tag.TagResponse;
import ru.ngtu.v1.routie.dto.tag.TagUpdateRequest;
import ru.ngtu.v1.routie.service.TagService;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

  @Override
  public List<TagResponse> getAllTags() {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public TagResponse getTagById(UUID tagId) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public TagResponse createTag(TagCreateRequest request) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public TagResponse updateTag(UUID tagId, TagUpdateRequest request) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public void deleteTag(UUID tagId) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }
}

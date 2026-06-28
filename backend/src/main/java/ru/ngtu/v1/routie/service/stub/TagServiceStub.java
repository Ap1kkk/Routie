package ru.ngtu.v1.routie.service.stub;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import ru.ngtu.v1.routie.dto.tag.TagCreateRequest;
import ru.ngtu.v1.routie.dto.tag.TagResponse;
import ru.ngtu.v1.routie.dto.tag.TagUpdateRequest;
import ru.ngtu.v1.routie.service.TagService;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@Profile("stub-tag")
@Primary
public class TagServiceStub implements TagService {

    @Override
    public List<TagResponse> getAllTags() {
        log.debug("[STUB] getAllTags");
        return FakeDataFactory.fakeTags(8);
    }

    @Override
    public TagResponse getTagById(UUID tagId) {
        log.debug("[STUB] getTagById: {}", tagId);
        return new TagResponse(tagId, FakeDataFactory.getFaker().lorem().word());
    }

    @Override
    public TagResponse createTag(TagCreateRequest request) {
        log.debug("[STUB] createTag: {}", request);
        return new TagResponse(UUID.randomUUID(), request.getTitle());
    }

    @Override
    public TagResponse updateTag(UUID tagId, TagUpdateRequest request) {
        log.debug("[STUB] updateTag: {}", tagId);
        return new TagResponse(tagId, request.getTitle());
    }

    @Override
    public void deleteTag(UUID tagId) {
        log.debug("[STUB] deleteTag: {}", tagId);
    }
}

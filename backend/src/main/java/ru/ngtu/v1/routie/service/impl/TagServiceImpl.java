package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.v1.routie.dto.tag.TagCreateRequest;
import ru.ngtu.v1.routie.dto.tag.TagResponse;
import ru.ngtu.v1.routie.dto.tag.TagUpdateRequest;
import ru.ngtu.v1.routie.exception.ConflictException;
import ru.ngtu.v1.routie.exception.EntityNotFoundException;
import ru.ngtu.v1.routie.model.Tag;
import ru.ngtu.v1.routie.repository.TagRepository;
import ru.ngtu.v1.routie.service.TagService;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TagResponse> getAllTags() {
        return tagRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TagResponse getTagById(UUID tagId) {
        return toResponse(findById(tagId));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public TagResponse createTag(TagCreateRequest request) {
        if (tagRepository.existsByTitleIgnoreCase(request.getTitle())) {
            throw new ConflictException("Тег с названием '" + request.getTitle() + "' уже существует");
        }

        Tag tag = Tag.builder()
                .title(request.getTitle())
                .build();

        tag = tagRepository.save(tag);
        log.info("Создан тег: id={}, title={}", tag.getId(), tag.getTitle());
        return toResponse(tag);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public TagResponse updateTag(UUID tagId, TagUpdateRequest request) {
        Tag tag = findById(tagId);

        if (tagRepository.existsByTitleIgnoreCaseAndIdNot(request.getTitle(), tagId)) {
            throw new ConflictException("Тег с названием '" + request.getTitle() + "' уже существует");
        }

        tag.setTitle(request.getTitle());
        tag = tagRepository.save(tag);
        log.info("Обновлён тег: id={}, title={}", tag.getId(), tag.getTitle());
        return toResponse(tag);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void deleteTag(UUID tagId) {
        Tag tag = findById(tagId);
        tagRepository.delete(tag);
        log.info("Удалён тег: id={}", tagId);
    }

    // ==================== Вспомогательные методы ====================

    private Tag findById(UUID tagId) {
        return tagRepository.findById(tagId)
                .orElseThrow(() -> new EntityNotFoundException("Тег", tagId));
    }

    private TagResponse toResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .title(tag.getTitle())
                .build();
    }
}

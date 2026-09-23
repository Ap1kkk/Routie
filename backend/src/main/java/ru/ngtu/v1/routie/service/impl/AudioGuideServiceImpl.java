package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.audioguide.request.AudioGuideCreateRequest;
import ru.ngtu.v1.routie.dto.audioguide.request.AudioGuideSearchFilter;
import ru.ngtu.v1.routie.dto.audioguide.response.AudioGuideResponse;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.exception.BadRequestException;
import ru.ngtu.v1.routie.exception.EntityNotFoundException;
import ru.ngtu.v1.routie.model.AudioGuide;
import ru.ngtu.v1.routie.repository.AudioGuideRepository;
import ru.ngtu.v1.routie.repository.MediaFileRepository;
import ru.ngtu.v1.routie.service.AudioGuideService;
import ru.ngtu.v1.routie.service.FileService;

import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AudioGuideServiceImpl implements AudioGuideService {

    private static final Set<String> ALLOWED_AUDIO_TYPES = Set.of(
            "audio/mpeg", "audio/ogg", "audio/wav", "audio/mp4"
    );

    private final AudioGuideRepository audioGuideRepository;
    private final MediaFileRepository mediaFileRepository;
    private final FileService fileService;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public AudioGuideResponse createAudioGuide(AudioGuideCreateRequest request) {
        AudioGuide audioGuide = AudioGuide.builder()
                .title(request.getTitle())
                .durationSeconds(request.getDurationSeconds())
                .build();

        audioGuide = audioGuideRepository.save(audioGuide);
        log.info("Создан аудиогид: id={}, title={}", audioGuide.getId(), audioGuide.getTitle());
        return toResponse(audioGuide);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public AudioGuideResponse updateAudioGuide(UUID audioGuideId, AudioGuideCreateRequest request) {
        AudioGuide audioGuide = findById(audioGuideId);

        audioGuide.setTitle(request.getTitle());
        if (request.getDurationSeconds() != null) {
            audioGuide.setDurationSeconds(request.getDurationSeconds());
        }

        audioGuide = audioGuideRepository.save(audioGuide);
        log.info("Обновлён аудиогид: id={}", audioGuideId);
        return toResponse(audioGuide);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void deleteAudioGuide(UUID audioGuideId) {
        AudioGuide audioGuide = findById(audioGuideId);
        audioGuideRepository.delete(audioGuide);
        log.info("Удалён аудиогид: id={}", audioGuideId);
    }

    @Override
    @Transactional(readOnly = true)
    public AudioGuideResponse getAudioGuide(UUID audioGuideId) {
        return toResponse(findById(audioGuideId));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AudioGuideResponse> searchAudioGuides(AudioGuideSearchFilter filter) {
        PageRequest pageable = PageRequest.of(filter.getPage(), filter.getSize());

        Page<AudioGuide> page = (filter.getTitle() != null && !filter.getTitle().isBlank())
                ? audioGuideRepository.findAllByTitleContainingIgnoreCase(filter.getTitle(), pageable)
                : audioGuideRepository.findAll(pageable);

        return new PageResponse<>(
                page.getContent().stream().map(this::toResponse).toList(),
                page.getTotalElements(),
                page.getTotalPages(),
                filter.getPage()
        );
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public MediaFileResponse uploadFile(UUID audioGuideId, MultipartFile file) {
        AudioGuide audioGuide = findById(audioGuideId);

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_AUDIO_TYPES.contains(contentType)) {
            throw new BadRequestException(
                    "Недопустимый тип файла: " + contentType + ". Разрешены только аудиофайлы: "
                            + ALLOWED_AUDIO_TYPES
            );
        }

        MediaFileResponse response = fileService.upload(file, 0);

        audioGuide.setFileId(response.getId());
        audioGuideRepository.save(audioGuide);

        log.info("Файл загружен для аудиогида: id={}, fileId={}", audioGuideId, response.getId());
        return response;
    }

    // ==================== Вспомогательные методы ====================

    private AudioGuide findById(UUID id) {
        return audioGuideRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Аудиогид", id));
    }

    private MediaFileResponse buildFileResponse(UUID fileId) {
        if (fileId == null) return null;
        return mediaFileRepository.findById(fileId)
                .map(f -> MediaFileResponse.builder()
                        .id(f.getId())
                        .filename(f.getOriginalFilename())
                        .contentType(f.getContentType())
                        .createTs(f.getCreatedAt())
                        .sortOrder(f.getSortOrder())
                        .build())
                .orElse(null);
    }

    private AudioGuideResponse toResponse(AudioGuide audioGuide) {
        return AudioGuideResponse.builder()
                .id(audioGuide.getId())
                .title(audioGuide.getTitle())
                .durationSeconds(audioGuide.getDurationSeconds())
                .file(buildFileResponse(audioGuide.getFileId()))
                .build();
    }
}

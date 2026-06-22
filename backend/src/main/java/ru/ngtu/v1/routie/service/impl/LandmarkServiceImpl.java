package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.audioguide.response.AudioGuideResponse;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.landmark.request.LandmarkCreateRequest;
import ru.ngtu.v1.routie.dto.landmark.request.LandmarkSearchFilter;
import ru.ngtu.v1.routie.dto.landmark.response.LandmarkResponse;
import ru.ngtu.v1.routie.exception.BadRequestException;
import ru.ngtu.v1.routie.exception.EntityNotFoundException;
import ru.ngtu.v1.routie.model.AudioGuide;
import ru.ngtu.v1.routie.model.Landmark;
import ru.ngtu.v1.routie.model.MediaFile;
import ru.ngtu.v1.routie.repository.AudioGuideRepository;
import ru.ngtu.v1.routie.repository.LandmarkRepository;
import ru.ngtu.v1.routie.repository.MediaFileRepository;
import ru.ngtu.v1.routie.service.FileService;
import ru.ngtu.v1.routie.service.LandmarkService;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LandmarkServiceImpl implements LandmarkService {

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );

    private final LandmarkRepository landmarkRepository;
    private final AudioGuideRepository audioGuideRepository;
    private final MediaFileRepository mediaFileRepository;
    private final FileService fileService;

    // ==================== CRUD ====================

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public LandmarkResponse createLandmark(LandmarkCreateRequest request) {
        UUID audioGuideId = validateAndResolveAudioGuide(request.getAudioGuideId());

        Landmark landmark = Landmark.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .audioGuideId(audioGuideId)
                .build();

        landmark = landmarkRepository.save(landmark);
        log.info("Создана достопримечательность: id={}, title={}", landmark.getId(), landmark.getTitle());
        return toResponse(landmark);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public LandmarkResponse updateLandmark(UUID landmarkId, LandmarkCreateRequest request) {
        Landmark landmark = findById(landmarkId);

        landmark.setTitle(request.getTitle());
        landmark.setDescription(request.getDescription());
        // null явно отвязывает аудиогид; иначе проверяем существование
        landmark.setAudioGuideId(validateAndResolveAudioGuide(request.getAudioGuideId()));

        landmark = landmarkRepository.save(landmark);
        log.info("Обновлена достопримечательность: id={}", landmarkId);
        return toResponse(landmark);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void deleteLandmark(UUID landmarkId) {
        Landmark landmark = findById(landmarkId);

        // Каскадно удаляем файлы из MinIO и media_files
        List<UUID> imageFileIds = new ArrayList<>(landmark.getImageFileIds());
        for (UUID fileId : imageFileIds) {
            try {
                fileService.delete(fileId);
            } catch (Exception e) {
                log.warn("Не удалось удалить файл {} при удалении landmark {}: {}", fileId, landmarkId, e.getMessage());
            }
        }

        landmarkRepository.delete(landmark);
        log.info("Удалена достопримечательность: id={}", landmarkId);
    }

    @Override
    @Transactional(readOnly = true)
    public LandmarkResponse getLandmark(UUID landmarkId) {
        return toResponse(findById(landmarkId));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<LandmarkResponse> searchLandmarks(LandmarkSearchFilter filter) {
        PageRequest pageable = PageRequest.of(filter.getPage(), filter.getSize());

        Page<Landmark> page = (filter.getTitle() != null && !filter.getTitle().isBlank())
                ? landmarkRepository.findAllByTitleContainingIgnoreCase(filter.getTitle(), pageable)
                : landmarkRepository.findAll(pageable);

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
    public List<MediaFileResponse> uploadImages(UUID landmarkId, List<MultipartFile> files) {
        Landmark landmark = findById(landmarkId);

        List<MediaFileResponse> uploaded = new ArrayList<>();
        int nextSortOrder = landmark.getImageFileIds().size();

        for (MultipartFile file : files) {
            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType)) {
                throw new BadRequestException(
                        "Недопустимый тип файла: " + contentType + ". Разрешены только изображения: " + ALLOWED_IMAGE_TYPES
                );
            }

            MediaFileResponse response = fileService.upload(file, nextSortOrder++);
            landmark.getImageFileIds().add(response.getId());
            uploaded.add(response);
        }

        landmarkRepository.save(landmark);
        log.info("Загружено {} изображений для landmark {}", uploaded.size(), landmarkId);
        return uploaded;
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void deleteAllImages(UUID landmarkId) {
        Landmark landmark = findById(landmarkId);

        List<UUID> imageFileIds = new ArrayList<>(landmark.getImageFileIds());
        for (UUID fileId : imageFileIds) {
            try {
                fileService.delete(fileId);
            } catch (Exception e) {
                log.warn("Не удалось удалить файл {} у landmark {}: {}", fileId, landmarkId, e.getMessage());
            }
        }

        landmark.getImageFileIds().clear();
        landmarkRepository.save(landmark);
        log.info("Удалены все изображения ({}) у достопримечательности {}", imageFileIds.size(), landmarkId);
    }

    // ==================== Вспомогательные методы ====================

    private Landmark findById(UUID id) {
        return landmarkRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Достопримечательность", id));
    }

    /**
     * Проверяет существование аудиогида если id указан.
     * Возвращает id если аудиогид найден, null если id == null.
     */
    private UUID validateAndResolveAudioGuide(UUID audioGuideId) {
        if (audioGuideId == null) return null;
        if (!audioGuideRepository.existsById(audioGuideId)) {
            throw new EntityNotFoundException("Аудиогид", audioGuideId);
        }
        return audioGuideId;
    }

    private MediaFileResponse buildFileResponse(MediaFile file) {
        if (file == null) return null;
        return MediaFileResponse.builder()
                .id(file.getId())
                .filename(file.getOriginalFilename())
                .contentType(file.getContentType())
                .createTs(file.getCreatedAt())
                .sortOrder(file.getSortOrder())
                .build();
    }

    private AudioGuideResponse buildAudioGuideResponse(UUID audioGuideId) {
        if (audioGuideId == null) return null;
        return audioGuideRepository.findById(audioGuideId)
                .map(ag -> AudioGuideResponse.builder()
                        .id(ag.getId())
                        .title(ag.getTitle())
                        .durationSeconds(ag.getDurationSeconds())
                        .file(ag.getFileId() != null
                                ? mediaFileRepository.findById(ag.getFileId()).map(this::buildFileResponse).orElse(null)
                                : null)
                        .build())
                .orElse(null);
    }

    private List<MediaFileResponse> buildImageResponses(List<UUID> fileIds) {
        if (fileIds == null || fileIds.isEmpty()) return List.of();
        return fileIds.stream()
                .map(id -> mediaFileRepository.findById(id)
                        .map(this::buildFileResponse)
                        .orElse(null))
                .filter(r -> r != null)
                .toList();
    }

    private LandmarkResponse toResponse(Landmark landmark) {
        return LandmarkResponse.builder()
                .id(landmark.getId())
                .title(landmark.getTitle())
                .description(landmark.getDescription())
                .images(buildImageResponses(landmark.getImageFileIds()))
                .audioGuide(buildAudioGuideResponse(landmark.getAudioGuideId()))
                .build();
    }
}

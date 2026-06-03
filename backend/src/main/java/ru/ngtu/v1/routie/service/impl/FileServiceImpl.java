package ru.ngtu.v1.routie.service.impl;

import io.minio.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.config.properties.MinioConfigProperties;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.exception.BadRequestException;
import ru.ngtu.v1.routie.exception.EntityNotFoundException;
import ru.ngtu.v1.routie.model.MediaFile;
import ru.ngtu.v1.routie.repository.MediaFileRepository;
import ru.ngtu.v1.routie.security.CustomUserDetails;
import ru.ngtu.v1.routie.service.FileService;

import java.io.InputStream;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif",
            "audio/mpeg", "audio/ogg", "audio/wav", "audio/mp4"
    );

    private final MinioClient minioClient;
    private final MinioConfigProperties minioProperties;
    private final MediaFileRepository mediaFileRepository;

    @Override
    @Transactional
    public MediaFileResponse upload(MultipartFile file, int sortOrder) {
        validateContentType(file);

        String storedFilename = UUID.randomUUID() + extractExtension(file.getOriginalFilename());
        String bucket = minioProperties.getBucket();

        try {
            ensureBucketExists(bucket);

            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(storedFilename)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build());
        } catch (Exception e) {
            log.error("Ошибка загрузки файла в MinIO: {}", e.getMessage(), e);
            throw new RuntimeException("Не удалось загрузить файл", e);
        }

        MediaFile mediaFile = MediaFile.builder()
                .originalFilename(file.getOriginalFilename())
                .storedFilename(storedFilename)
                .contentType(file.getContentType())
                .sizeBytes(file.getSize())
                .sortOrder(sortOrder)
                .uploadedBy(getCurrentUserId())
                .build();

        mediaFileRepository.save(mediaFile);
        log.info("Файл загружен: {} -> {}", file.getOriginalFilename(), storedFilename);

        return toResponse(mediaFile);
    }

    @Override
    public InputStream download(UUID fileId) {
        MediaFile mediaFile = getById(fileId);

        try {
            return minioClient.getObject(GetObjectArgs.builder()
                    .bucket(minioProperties.getBucket())
                    .object(mediaFile.getStoredFilename())
                    .build());
        } catch (Exception e) {
            log.error("Ошибка скачивания файла из MinIO: {}", e.getMessage(), e);
            throw new RuntimeException("Не удалось скачать файл", e);
        }
    }

    @Override
    public MediaFile getById(UUID fileId) {
        return mediaFileRepository.findById(fileId)
                .orElseThrow(() -> new EntityNotFoundException("Файл", fileId));
    }

    @Override
    @Transactional
    public void delete(UUID fileId) {
        MediaFile mediaFile = getById(fileId);

        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(minioProperties.getBucket())
                    .object(mediaFile.getStoredFilename())
                    .build());
        } catch (Exception e) {
            log.error("Ошибка удаления файла из MinIO: {}", e.getMessage(), e);
            throw new RuntimeException("Не удалось удалить файл", e);
        }

        mediaFileRepository.delete(mediaFile);
        log.info("Файл удалён: {}", mediaFile.getStoredFilename());
    }

    private void validateContentType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new BadRequestException(
                    "Неподдерживаемый тип файла: " + contentType + ". Разрешены: изображения и аудио"
            );
        }
    }

    private void ensureBucketExists(String bucket) throws Exception {
        boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
        if (!exists) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            log.info("Создан bucket: {}", bucket);
        }
    }

    private String extractExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.'));
    }

    private UUID getCurrentUserId() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return userDetails.getId();
    }

    private MediaFileResponse toResponse(MediaFile mediaFile) {
        return new MediaFileResponse(
                mediaFile.getId(),
                mediaFile.getOriginalFilename(),
                mediaFile.getContentType(),
                mediaFile.getCreatedAt(),
                mediaFile.getSortOrder()
        );
    }
}

package ru.ngtu.twosteps.image;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.twosteps.common.config.properties.MinioConfigProperties;
import ru.ngtu.twosteps.jpa.entity.ImageInfo;
import ru.ngtu.twosteps.jpa.repository.ImageInfoRepositoryFacade;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageStorageService {

  private final MinioClient minioClient;
  private final MinioConfigProperties minioConfigProperties;
  private final ImageInfoRepositoryFacade imageInfoRepositoryFacade;

  @Transactional
  public ImageInfo uploadFile(MultipartFile file) {
    try {
      ImageInfo imageInfo = imageInfoRepositoryFacade.save(ImageInfo.builder()
          .filename(file.getOriginalFilename())
          .contentType(file.getContentType())
          .createTs(Instant.now())
          .deleted(false)
          .build());

      minioClient.putObject(
          PutObjectArgs.builder()
              .bucket(minioConfigProperties.getBucket())
              .object(imageInfo.getId().toString())
              .stream(file.getInputStream(), file.getSize(), -1)
              .contentType(file.getContentType())
              .build()
      );

      return imageInfo;
    } catch (Exception e) {
      throw new RuntimeException("Failed to upload file", e);
    }
  }

  @Transactional
  public ImageInfo getFile(UUID fileId) {
    try {
      ImageInfo imageInfo = imageInfoRepositoryFacade.getSoftDeletableById(fileId);
      imageInfo.setStream(new InputStreamResource(minioClient.getObject(GetObjectArgs.builder()
          .bucket(minioConfigProperties.getBucket())
          .object(imageInfo.getId().toString())
          .build())));
      return imageInfo;
    } catch (Exception e) {
      throw new RuntimeException("Failed to get file", e);
    }
  }

  @Transactional
  public void deleteFile(UUID fileId) {
    ImageInfo imageInfo = imageInfoRepositoryFacade.getSoftDeletableById(fileId);
    try {
      minioClient.removeObject(RemoveObjectArgs.builder()
          .bucket(minioConfigProperties.getBucket())
          .object(imageInfo.getId().toString())
          .build());
    } catch (Exception e) {
      throw new RuntimeException("Failed to delete file", e);
    }
    imageInfo.setDeleted(true);
    imageInfoRepositoryFacade.save(imageInfo);
  }
}

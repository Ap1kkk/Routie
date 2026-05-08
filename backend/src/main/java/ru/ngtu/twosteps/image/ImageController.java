package ru.ngtu.twosteps.image;

import io.swagger.v3.oas.annotations.Operation;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.twosteps.jpa.entity.ImageInfo;

@RestController
@RequestMapping("/api/v1/images")
@RequiredArgsConstructor
public class ImageController {

  private final ImageStorageService imageStorageService;

  @GetMapping("/view/{fileId}")
  public ResponseEntity<InputStreamResource> downloadFile(@PathVariable UUID fileId) {
    ImageInfo imageInfo = imageStorageService.getFile(fileId);
    return ResponseEntity
        .ok()
        .contentType(MediaType.valueOf(imageInfo.getContentType()))
        .body(imageInfo.getStream());
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ImageInfo uploadFile(@RequestPart("file") MultipartFile file) {
    return imageStorageService.uploadFile(file);
  }

  @DeleteMapping("/{fileId}")
  public void deleteFile(@PathVariable UUID fileId) {
    imageStorageService.deleteFile(fileId);
  }
}

package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
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
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.ApiResponseVoid;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;

@RestController
@RequestMapping("/api/v1/file")
@RequiredArgsConstructor
@Tag(name = "File", description = "Управление файлами")
public class FileControllerV1 {

  @GetMapping("/download/{fileId}")
  public ResponseEntity<InputStreamResource> downloadFile(@PathVariable UUID fileId) {
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<MediaFileResponse> uploadFile(@RequestPart("file") MultipartFile file) {
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @DeleteMapping("/{fileId}")
  public ApiResponseVoid deleteFile(@PathVariable UUID fileId) {
    throw new UnsupportedOperationException("Not implemented yet");
  }
}

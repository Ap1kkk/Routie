package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.ApiResponseVoid;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.model.MediaFile;
import ru.ngtu.v1.routie.service.FileService;

import java.io.InputStream;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/file")
@RequiredArgsConstructor
@Tag(name = "File", description = "Управление файлами")
public class FileControllerV1 {

    private final FileService fileService;

    @GetMapping("/download/{fileId}")
    @Operation(summary = "Скачать файл")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable UUID fileId) {
        MediaFile mediaFile = fileService.getById(fileId);
        InputStream stream = fileService.download(fileId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mediaFile.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + mediaFile.getOriginalFilename() + "\"")
                .body(new InputStreamResource(stream));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Загрузить файл")
    public ApiResponse<MediaFileResponse> uploadFile(
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "sortOrder", defaultValue = "0") int sortOrder
    ) {
        return ApiResponse.of(fileService.upload(file, sortOrder));
    }

    @DeleteMapping("/{fileId}")
    @Operation(summary = "Удалить файл")
    public ApiResponseVoid deleteFile(@PathVariable UUID fileId) {
        fileService.delete(fileId);
        return ApiResponse.empty();
    }
}

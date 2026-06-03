package ru.ngtu.v1.routie.service;

import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.model.MediaFile;

import java.io.InputStream;
import java.util.UUID;

public interface FileService {

    MediaFileResponse upload(MultipartFile file, int sortOrder);

    InputStream download(UUID fileId);

    MediaFile getById(UUID fileId);

    void delete(UUID fileId);
}

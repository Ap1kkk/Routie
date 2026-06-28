package ru.ngtu.v1.routie.service;

import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.landmark.request.LandmarkCreateRequest;
import ru.ngtu.v1.routie.dto.landmark.request.LandmarkSearchFilter;
import ru.ngtu.v1.routie.dto.landmark.response.LandmarkResponse;

import java.util.List;
import java.util.UUID;

public interface LandmarkService {

    LandmarkResponse createLandmark(LandmarkCreateRequest request);

    LandmarkResponse updateLandmark(UUID landmarkId, LandmarkCreateRequest request);

    void deleteLandmark(UUID landmarkId);

    LandmarkResponse getLandmark(UUID landmarkId);

    PageResponse<LandmarkResponse> searchLandmarks(LandmarkSearchFilter filter);

    List<MediaFileResponse> uploadImages(UUID landmarkId, List<MultipartFile> files);

    /**
     * Удаляет все изображения достопримечательности (физически из MinIO и из media_files),
     * саму достопримечательность не трогает.
     */
    void deleteAllImages(UUID landmarkId);
}

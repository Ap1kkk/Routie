package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.landmark.request.LandmarkCreateRequest;
import ru.ngtu.v1.routie.dto.landmark.request.LandmarkSearchFilter;
import ru.ngtu.v1.routie.dto.landmark.response.LandmarkResponse;
import ru.ngtu.v1.routie.service.LandmarkService;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LandmarkServiceImpl implements LandmarkService {

  @Override
  public LandmarkResponse createLandmark(LandmarkCreateRequest request) {
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public LandmarkResponse updateLandmark(UUID landmarkId, LandmarkCreateRequest request) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public void deleteLandmark(UUID landmarkId) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public LandmarkResponse getLandmark(UUID landmarkId) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public PageResponse<LandmarkResponse> searchLandmarks(LandmarkSearchFilter filter) {
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public List<MediaFileResponse> uploadImages(UUID landmarkId, List<MultipartFile> files) {
    // TODO: implement
    throw new UnsupportedOperationException("Not implemented yet");
  }
}

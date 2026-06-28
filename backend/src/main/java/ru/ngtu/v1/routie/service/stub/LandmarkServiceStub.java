package ru.ngtu.v1.routie.service.stub;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.landmark.request.LandmarkCreateRequest;
import ru.ngtu.v1.routie.dto.landmark.request.LandmarkSearchFilter;
import ru.ngtu.v1.routie.dto.landmark.response.LandmarkResponse;
import ru.ngtu.v1.routie.service.LandmarkService;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@Profile("stub-landmark")
@Primary
public class LandmarkServiceStub implements LandmarkService {

    @Override
    public LandmarkResponse createLandmark(LandmarkCreateRequest request) {
        log.debug("[STUB] createLandmark: {}", request.getTitle());
        LandmarkResponse landmark = FakeDataFactory.fakeLandmark();
        landmark.setTitle(request.getTitle());
        if (request.getDescription() != null) landmark.setDescription(request.getDescription());
        return landmark;
    }

    @Override
    public LandmarkResponse updateLandmark(UUID landmarkId, LandmarkCreateRequest request) {
        log.debug("[STUB] updateLandmark: {}", landmarkId);
        LandmarkResponse landmark = FakeDataFactory.fakeLandmark();
        landmark.setId(landmarkId);
        landmark.setTitle(request.getTitle());
        if (request.getDescription() != null) landmark.setDescription(request.getDescription());
        return landmark;
    }

    @Override
    public void deleteLandmark(UUID landmarkId) {
        log.debug("[STUB] deleteLandmark: {}", landmarkId);
    }

    @Override
    public LandmarkResponse getLandmark(UUID landmarkId) {
        log.debug("[STUB] getLandmark: {}", landmarkId);
        LandmarkResponse landmark = FakeDataFactory.fakeLandmark();
        landmark.setId(landmarkId);
        return landmark;
    }

    @Override
    public PageResponse<LandmarkResponse> searchLandmarks(LandmarkSearchFilter filter) {
        log.debug("[STUB] searchLandmarks page={}, size={}", filter.getPage(), filter.getSize());
        long total = 34L;
        List<LandmarkResponse> content = FakeDataFactory.fakeLandmarks(filter.getSize());
        return FakeDataFactory.fakePage(content, filter.getPage(), filter.getSize(), total);
    }

    @Override
    public List<MediaFileResponse> uploadImages(UUID landmarkId, List<MultipartFile> files) {
        log.debug("[STUB] uploadImages landmarkId={}, count={}", landmarkId, files.size());
        return FakeDataFactory.fakeMediaFiles(files.size());
    }

    @Override
    public void deleteAllImages(UUID landmarkId) {
        log.debug("[STUB] deleteAllImages landmarkId={}", landmarkId);
    }
}

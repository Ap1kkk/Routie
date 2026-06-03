package ru.ngtu.v1.routie.service;

import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.audioguide.request.AudioGuideCreateRequest;
import ru.ngtu.v1.routie.dto.audioguide.request.AudioGuideSearchFilter;
import ru.ngtu.v1.routie.dto.audioguide.response.AudioGuideResponse;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;

import java.util.UUID;

public interface AudioGuideService {

    AudioGuideResponse createAudioGuide(AudioGuideCreateRequest request);

    AudioGuideResponse updateAudioGuide(UUID audioGuideId, AudioGuideCreateRequest request);

    void deleteAudioGuide(UUID audioGuideId);

    AudioGuideResponse getAudioGuide(UUID audioGuideId);

    PageResponse<AudioGuideResponse> searchAudioGuides(AudioGuideSearchFilter filter);

    MediaFileResponse uploadFile(UUID audioGuideId, MultipartFile file);
}

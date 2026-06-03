package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.audioguide.request.AudioGuideCreateRequest;
import ru.ngtu.v1.routie.dto.audioguide.request.AudioGuideSearchFilter;
import ru.ngtu.v1.routie.dto.audioguide.response.AudioGuideResponse;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.service.AudioGuideService;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AudioGuideServiceImpl implements AudioGuideService {

    @Override
    public AudioGuideResponse createAudioGuide(AudioGuideCreateRequest request) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public AudioGuideResponse updateAudioGuide(UUID audioGuideId, AudioGuideCreateRequest request) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public void deleteAudioGuide(UUID audioGuideId) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public AudioGuideResponse getAudioGuide(UUID audioGuideId) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public PageResponse<AudioGuideResponse> searchAudioGuides(AudioGuideSearchFilter filter) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public MediaFileResponse uploadFile(UUID audioGuideId, MultipartFile file) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

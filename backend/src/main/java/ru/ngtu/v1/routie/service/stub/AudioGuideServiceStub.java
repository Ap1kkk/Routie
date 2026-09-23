package ru.ngtu.v1.routie.service.stub;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.audioguide.request.AudioGuideCreateRequest;
import ru.ngtu.v1.routie.dto.audioguide.request.AudioGuideSearchFilter;
import ru.ngtu.v1.routie.dto.audioguide.response.AudioGuideResponse;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.service.AudioGuideService;

import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;

@Slf4j
@Service
@Profile("stub-audio-guide")
@Primary
public class AudioGuideServiceStub implements AudioGuideService {

    @Override
    public AudioGuideResponse createAudioGuide(AudioGuideCreateRequest request) {
        log.debug("[STUB] createAudioGuide: {}", request.getTitle());
        AudioGuideResponse guide = FakeDataFactory.fakeAudioGuide();
        guide.setTitle(request.getTitle());
        if (request.getDurationSeconds() != null) guide.setDurationSeconds(request.getDurationSeconds());
        return guide;
    }

    @Override
    public AudioGuideResponse updateAudioGuide(UUID audioGuideId, AudioGuideCreateRequest request) {
        log.debug("[STUB] updateAudioGuide: {}", audioGuideId);
        AudioGuideResponse guide = FakeDataFactory.fakeAudioGuide();
        guide.setId(audioGuideId);
        guide.setTitle(request.getTitle());
        if (request.getDurationSeconds() != null) guide.setDurationSeconds(request.getDurationSeconds());
        return guide;
    }

    @Override
    public void deleteAudioGuide(UUID audioGuideId) {
        log.debug("[STUB] deleteAudioGuide: {}", audioGuideId);
    }

    @Override
    public AudioGuideResponse getAudioGuide(UUID audioGuideId) {
        log.debug("[STUB] getAudioGuide: {}", audioGuideId);
        AudioGuideResponse guide = FakeDataFactory.fakeAudioGuide();
        guide.setId(audioGuideId);
        return guide;
    }

    @Override
    public PageResponse<AudioGuideResponse> searchAudioGuides(AudioGuideSearchFilter filter) {
        log.debug("[STUB] searchAudioGuides page={}, size={}", filter.getPage(), filter.getSize());
        long total = 25L;
        List<AudioGuideResponse> content = IntStream.range(0, filter.getSize())
                .mapToObj(i -> FakeDataFactory.fakeAudioGuide())
                .toList();
        return FakeDataFactory.fakePage(content, filter.getPage(), filter.getSize(), total);
    }

    @Override
    public MediaFileResponse uploadFile(UUID audioGuideId, MultipartFile file) {
        log.debug("[STUB] uploadFile audioGuideId={}, filename={}", audioGuideId, file.getOriginalFilename());
        MediaFileResponse response = FakeDataFactory.fakeMediaFile();
        response.setContentType("audio/mpeg");
        if (file.getOriginalFilename() != null) {
            response.setFilename(file.getOriginalFilename());
        }
        return response;
    }
}

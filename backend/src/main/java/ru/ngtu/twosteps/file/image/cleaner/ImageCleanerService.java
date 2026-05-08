package ru.ngtu.twosteps.file.image.cleaner;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import ru.ngtu.twosteps.file.FileService;
import ru.ngtu.twosteps.jpa.entity.Image;

import java.util.List;
import ru.ngtu.twosteps.jpa.entity.ImageToClean;
import ru.ngtu.twosteps.jpa.repository.ImageToCleanRepository;

/**
 * @author Egor Bokov
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ImageCleanerService {

    private final ImageToCleanRepository repository;
    private final FileService fileService;

    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanup() {
        log.debug("Image cleanup started");
        repository.findAll().forEach(this::cleanImage);
    }

    public List<ImageToClean> getAll() {
        return repository.findAll();
    }

    public void addImageToClean(Image image) {
        log.debug("Adding image to clean: {}", image);
        repository.save(ImageToClean.builder().image(image).build());
    }

    private void cleanImage(ImageToClean imageToClean) {
        try {
            log.debug("Clean image: {}", imageToClean);
            fileService.safeDelete(imageToClean.getImage().getPath());
            repository.delete(imageToClean);
        } catch (Exception e) {
            log.error("Error happened while cleaning image: {}", e.getMessage(), e);
        }
    }
}

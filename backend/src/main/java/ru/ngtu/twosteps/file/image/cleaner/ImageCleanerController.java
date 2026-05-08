package ru.ngtu.twosteps.file.image.cleaner;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import ru.ngtu.twosteps.jpa.entity.ImageToClean;

/**
 * @author Egor Bokov
 */
@RestController
@RequestMapping("/api/v1/admin/image-cleaner")
@RequiredArgsConstructor
@Tag(name = "Image cleaner", description = "Image cleaner endpoints")
public class ImageCleanerController {

    private final ImageCleanerService service;

    @GetMapping("/all")
    public List<ImageToClean> getAll() {
        return service.getAll();
    }

    @DeleteMapping("/cleanup")
    public void cleanup() {
        service.cleanup();
    }
}
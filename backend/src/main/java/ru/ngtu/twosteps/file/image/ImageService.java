package ru.ngtu.twosteps.file.image;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.twosteps.file.FileService;
import ru.ngtu.twosteps.file.enums.TargetDirectory;
import ru.ngtu.twosteps.file.image.cleaner.ImageCleanerService;
import ru.ngtu.twosteps.file.image.handler.ImageHandlingType;

import java.util.*;
import java.util.stream.Stream;
import ru.ngtu.twosteps.jpa.entity.Image;
import ru.ngtu.twosteps.jpa.repository.ImageRepository;

/**
 * @author Egor Bokov
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ImageService {

    private final FileService fileService;
    private final ImageRepository repository;
    private final ImageValidator validator;
    private final ImageMapper mapper;
    private final ImageCleanerService cleanerService;

    private final Map<UUID, Image> imagesMap = new HashMap<>();
    private final Map<UUID, ImageDto> imagesDtoMap = new HashMap<>();
    private final List<Image> createdImages = new ArrayList<>();

    @Transactional
    public Image handleImage(Image existingImage, ImageDto imageDto, TargetDirectory targetDirectory, boolean isRequired) {
        reset();
        fillImages(existingImage);
        fillImageDtos(imageDto);

        ImageHandlingType handlingType = validator.validate(imageDto);

        if(handlingType.equals(ImageHandlingType.DELETE) && isRequired)
            throw new UnsupportedOperationException("Unable to delete required image");

        handle(imageDto, targetDirectory);

        handleImagesToDelete();

        List<Image> updatedImages = getUpdatedImages();
        Image targetImage;
        if (updatedImages == null ||updatedImages.isEmpty())
            targetImage = null;
        else
            targetImage = updatedImages.getFirst();

        return targetImage;
    }

    @Transactional
    public List<Image> handleImages(List<Image> existingImages, List<ImageDto> newImages, TargetDirectory targetDirectory) {
        reset();
        fillImages(existingImages);
        fillImageDtos(newImages);

        //TODO needs tests
        if(newImages == null || newImages.isEmpty())
            return existingImages;

        newImages.forEach(image -> handle(image, targetDirectory));
        handleImagesToDelete();

        return getUpdatedImages();
    }

    @Transactional
    public void deleteImage(Image image) {
        if(image == null)
            return;

        cleanerService.addImageToClean(image);
    }

    @Transactional
    public void deleteImages(List<Image> images) {
        if(images == null)
            return;

        images.forEach(this::deleteImage);
    }

    private void handle(ImageDto dto, TargetDirectory targetDirectory) {
        ImageHandlingType handlingType = validator.validate(dto);
        switch (handlingType) {
            case CREATE -> create(dto, targetDirectory);
            case UPDATE -> update(dto);
            case DELETE -> delete(dto.getId());
        }
    }

    private void reset() {
        imagesMap.clear();
        imagesDtoMap.clear();
        createdImages.clear();
    }

    private void fillImages(Image image) {
        if(image == null)
            return;

        imagesMap.put(image.getId(), image);
    }

    private void fillImages(List<Image> images) {
        if(images == null)
            return;

        for (Image image : images) {
            imagesMap.put(image.getId(), image);
        }
    }

    private void fillImageDtos(ImageDto dto) {
        if(dto == null || dto.getId() == null)
            return;

        imagesDtoMap.put(dto.getId(), dto);
    }

    private void fillImageDtos(List<ImageDto> imageDtos) {
        if(imageDtos == null)
            return;

        for (ImageDto imageDto : imageDtos) {
            if(imageDto.getId() != null)
                imagesDtoMap.put(imageDto.getId(), imageDto);
        }
    }

    private void handleImagesToDelete() {
        List<Image> imagesToDelete = imagesMap
                .values()
                .stream()
                .filter(image -> !isDtoExists(image.getId()))
                .toList();

        imagesToDelete.forEach(image -> delete(image.getId()));
    }

    private List<Image> getUpdatedImages() {
        return Stream
                .concat(imagesMap.values().stream(), createdImages.stream())
                .toList();
    }

    @SneakyThrows
    private void create(ImageDto dto, TargetDirectory targetDirectory) {
        String imagePath = fileService.upload(dto.getFile(), targetDirectory);

        Image createdImage = mapper.map(dto);
        createdImage.setPath(imagePath);

        createdImages.add(createdImage);
        repository.save(createdImage);
    }

    private void update(ImageDto imageDto) {
        Image image = get(imageDto.getId());
        if(image == null)
            return;

        mapper.map(image, imageDto);
        repository.save(image);
    }

    private void delete(UUID imageId) {
        Image image = get(imageId);
        if(image == null)
            return;

        cleanerService.addImageToClean(image);
        imagesMap.remove(imageId);
    }

    private Image get(UUID imageId) {
        return repository
                .findById(imageId)
                .orElse(imagesMap.get(imageId));
    }

    private boolean isDtoExists(UUID imageId) {
        return imagesDtoMap.containsKey(imageId);
    }
}
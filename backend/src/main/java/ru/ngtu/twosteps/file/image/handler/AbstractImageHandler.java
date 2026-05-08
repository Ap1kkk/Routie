package ru.ngtu.twosteps.file.image.handler;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import ru.ngtu.twosteps.file.enums.TargetDirectory;
import ru.ngtu.twosteps.jpa.entity.Image;
import ru.ngtu.twosteps.file.image.ImageDto;
import ru.ngtu.twosteps.file.image.ImageService;

import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Egor Bokov
 */
@RequiredArgsConstructor
public abstract class AbstractImageHandler<E, D> {

    private final Map<Field, Field> fieldMappings = new HashMap<>();
    private final Map<Field, TargetDirectory> entityDirectoryMappings = new HashMap<>();
    private Class<E> entityClass;
    private  Class<D> dtoClass;
    private final ImageService imageService;

    @PostConstruct
    public void initMappings() {
        this.entityClass = getEntityClass();
        this.dtoClass = getDtoClass();

        for (Field entityField : entityClass.getDeclaredFields()) {
            ImageToHandle entityAnnotation = entityField.getAnnotation(ImageToHandle.class);
            if (entityField.isAnnotationPresent(ImageToHandle.class)) {
                Field dtoField = findFieldByAnnotationId(dtoClass, entityAnnotation.id());

                if (dtoField != null && dtoField.isAnnotationPresent(ImageToHandle.class)) {
                    ImageToHandle dtoAnnotation = dtoField.getAnnotation(ImageToHandle.class);
                    if (dtoAnnotation.id().equals(entityAnnotation.id())) {
                        validateFieldTypes(entityField, dtoField);
                        fieldMappings.put(entityField, dtoField);

                        TargetDirectory directoryEnum = TargetDirectory.fromString(entityAnnotation.directory());
                        entityDirectoryMappings.put(entityField, directoryEnum);
                    }
                } else {
                    throw new IllegalArgumentException(
                            String.format(
                                    "Entity %s field '%s' with id '%s' is not annotated with @ImageToHandle in DTO %s",
                                    entityClass.getSimpleName(),
                                    entityField.getName(),
                                    entityAnnotation.id(),
                                    dtoClass.getSimpleName()
                            ));
                }
            }
        }
    }

    public void delete(E entity) {
        try {
            for (Field entityField : fieldMappings.keySet()) {
                entityField.setAccessible(true);

                if (List.class.isAssignableFrom(entityField.getType())) {
                    List<Image> images = (List<Image>) entityField.get(entity);
                    imageService.deleteImages(images);
                } else {
                    Image image = (Image) entityField.get(entity);
                    imageService.deleteImage(image);
                }
            }
        } catch (IllegalAccessException e) {
            throw new RuntimeException("Error processing images", e);
        }
    }

    public void handle(E entity, D dto) {
        try {
            for (Map.Entry<Field, Field> entry : fieldMappings.entrySet()) {
                Field entityField = entry.getKey();
                Field dtoField = entry.getValue();

                entityField.setAccessible(true);
                dtoField.setAccessible(true);

                if (List.class.isAssignableFrom(entityField.getType()) && List.class.isAssignableFrom(dtoField.getType())) {
                    List<ImageDto> imageDtos = (List<ImageDto>) dtoField.get(dto);
                    List<Image> convertedImages = processImages(
                            (List<Image>) entityField.get(entity),
                            imageDtos,
                            findDirectory(entityField)
                    );

                    List<Image> entityImageCollection = (List<Image>) entityField.get(entity);
                    if (entityImageCollection != null) {
                        entityImageCollection.clear();
                        entityImageCollection.addAll(convertedImages);
                    } else {
                        entityField.set(entity, convertedImages);
                    }
                } else if (entityField.getType().equals(Image.class) && dtoField.getType().equals(ImageDto.class)) {
                    ImageDto imageDto = (ImageDto) dtoField.get(dto);
                    Image image = processImage(
                            (Image) entityField.get(entity),
                            imageDto,
                            findDirectory(entityField),
                            dtoField.getAnnotation(ImageToHandle.class).isRequired()
                    );
                    entityField.set(entity, image);
                }
            }
        } catch (IllegalAccessException e) {
            throw new RuntimeException("Error processing images", e);
        }
    }

    private Field findFieldByAnnotationId(Class<?> clazz, String id) {
        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(ImageToHandle.class)) {
                ImageToHandle annotation = field.getAnnotation(ImageToHandle.class);
                if (annotation.id().equals(id)) {
                    return field;
                }
            }
        }
        return null;
    }

    private void validateFieldTypes(Field entityField, Field dtoField) {
        boolean isEntityFieldList = List.class.isAssignableFrom(entityField.getType());
        boolean isDtoFieldList = List.class.isAssignableFrom(dtoField.getType());

        if (isEntityFieldList && isDtoFieldList) {
            validateListFieldTypes(entityField, dtoField);
        }
        else {
            if(!entityField.getType().equals(Image.class))
                throw new IllegalStateException(
                        String.format(
                                "Entity %s field's %s type must be %s",
                                entityClass.getSimpleName(),
                                entityField.getName(),
                                Image.class.getSimpleName()
                        ));

            if(!dtoField.getType().equals(ImageDto.class))
                throw new IllegalStateException(
                        String.format(
                                "DTO %s field's %s type must be %s",
                                dtoClass.getSimpleName(),
                                dtoField.getName(),
                                ImageDto.class.getSimpleName()
                        ));
        }
    }

    private void validateListFieldTypes(Field entityField, Field dtoField) {
        Type entityListType = getListGenericType(entityField);
        Type dtoListType = getListGenericType(dtoField);

        if (entityListType== null || !entityListType.equals(Image.class)) {
            throw new IllegalArgumentException(
                    String.format(
                            "Entity %s field's %s list generic type must be %s, but was %s",
                            entityClass.getSimpleName(),
                            entityField.getName(),
                            Image.class.getSimpleName(),
                            entityListType
                    ));
        }

        if (dtoListType == null || !dtoListType.equals(ImageDto.class)) {
            throw new IllegalArgumentException(
                    String.format(
                            "DTO %s field's %s list generic type must be %s, but was %s",
                            dtoClass.getSimpleName(),
                            dtoField.getName(),
                            ImageDto.class.getSimpleName(),
                            dtoListType
                    ));
        }
    }

    private Type getListGenericType(Field field) {
        if (field.getGenericType() instanceof ParameterizedType parameterizedType) {
            return parameterizedType.getActualTypeArguments()[0];
        }
        return null;
    }

    private TargetDirectory findDirectory(Field entityField) {
        if(!entityDirectoryMappings.containsKey(entityField))
            throw new IllegalStateException(String.format(
                    "Entity %s field's %s target directory not found",
                    entityClass.getSimpleName(),
                    entityField.getName()
            ));

        return entityDirectoryMappings.get(entityField);
    }

    private List<Image> processImages(List<Image> existingImages, List<ImageDto> imageDtos, TargetDirectory targetDirectory) {
        return imageService.handleImages(existingImages, imageDtos, targetDirectory);
    }

    private Image processImage(Image existingImage, ImageDto imageDto, TargetDirectory targetDirectory, boolean isRequired) {
        return imageService.handleImage(existingImage, imageDto, targetDirectory, isRequired);
    }

    private Class<E> getEntityClass() {
        ParameterizedType parameterizedType = (ParameterizedType) getClass().getGenericSuperclass();

        Type[] typeArguments = parameterizedType.getActualTypeArguments();

        return (Class<E>) typeArguments[0];
    }

    private Class<D> getDtoClass() {
        ParameterizedType parameterizedType = (ParameterizedType) getClass().getGenericSuperclass();
        Type[] typeArguments = parameterizedType.getActualTypeArguments();

        return (Class<D>) typeArguments[1];
    }
}

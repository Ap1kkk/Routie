package ru.ngtu.twosteps.file.image;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.twosteps.file.image.handler.ImageHandlingType;
import ru.ngtu.twosteps.common.exceptions.classes.validation.ValidationException;

import java.util.List;
import java.util.UUID;

import static ru.ngtu.twosteps.common.exceptions.classes.validation.ValidationViolationDto.requiredIsNull;

/**
 * @author Egor Bokov
 */
@Component
public class ImageValidator {
    private static final String VALIDATION_MESSAGE = "Image dto validation failed";


    public void validate(List<ImageDto> dtos) {
        ValidationException.Builder builder = ValidationException.builder().message(VALIDATION_MESSAGE);
        validate(dtos, builder);
    }

    public void validate(List<ImageDto> dtos, ValidationException.Builder builder) {
        if (dtos == null) {
            builder.addViolation(requiredIsNull("dtos", "Dtos"));
            throw builder.build();
        }

        for (ImageDto dto : dtos) {
            validate(dto, builder);
        }
    }

    public ImageHandlingType validate(final ImageDto dto) {
        ValidationException.Builder builder = ValidationException.builder().message(VALIDATION_MESSAGE);
        return validate(dto, builder);
    }

    public ImageHandlingType validate(final ImageDto dto, ValidationException.Builder builder) {
        if (dto == null) {
            builder.addViolation(requiredIsNull("dto", "Dto"));
            throw builder.build();
        }

        boolean isIdEmpty = isEmpty(dto.getId());
        boolean isFileEmpty = isEmpty(dto.getFile());
        boolean isOrderEmpty = isEmpty(dto.getDisplayOrder());

        if(isIdEmpty && isFileEmpty) {
            builder.addViolation(requiredIsNull("id|file", "Id or file"));
            throw builder.build();
        }

        if(!isFileEmpty) {
            if(isOrderEmpty) {
                builder.addViolation(
                        requiredIsNull(
                                "displayOrder",
                                "When file is uploaded, display order"
                        )
                );
                throw builder.build();
            }

            return ImageHandlingType.CREATE;
        }

        if(isOrderEmpty)
            return ImageHandlingType.DELETE;

        return ImageHandlingType.UPDATE;
    }

    private boolean isEmpty(final UUID uuid) {
        return uuid == null;
    }

    private boolean isEmpty(final Integer number) {
        return number == null;
    }

    private boolean isEmpty(final MultipartFile file) {
        return file == null || file.isEmpty();
    }
}

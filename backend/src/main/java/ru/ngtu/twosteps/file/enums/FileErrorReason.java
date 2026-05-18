package ru.ngtu.twosteps.file.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import ru.ngtu.twosteps.common.exceptions.reasons.ErrorReason;

/**
 * @author Egor Bokov
 */
@Getter
@RequiredArgsConstructor
public enum FileErrorReason implements ErrorReason {
    FILE_ERROR("file_error", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String reason;
    private final HttpStatus status;
}

package ru.ngtu.twosteps.common.exceptions.reasons;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * Default set of {@link ErrorReason error reasons}
 */
@Getter
@RequiredArgsConstructor
public enum DefaultErrorReason implements ErrorReason {
    AUTHENTICATION_ERROR("authentication_error", HttpStatus.FORBIDDEN),
    PERMISSION_DENIED("permission_denied", HttpStatus.FORBIDDEN),
    ACCESS_DENIED("access_denied", HttpStatus.FORBIDDEN),
    VALIDATION_FAILED("validation_failed", HttpStatus.BAD_REQUEST),
    INVALID_OPERATION("invalid_operation", HttpStatus.BAD_REQUEST),
    NOT_FOUND("not_found", HttpStatus.NOT_FOUND),
    ALREADY_EXISTS("already_exists", HttpStatus.BAD_REQUEST),
    UNSUPPORTED_MEDIA_TYPE("unsupported_media_type", HttpStatus.UNSUPPORTED_MEDIA_TYPE),
    METHOD_NOT_ALLOWED("method_not_allowed", HttpStatus.METHOD_NOT_ALLOWED),
    UNKNOWN("unknown", HttpStatus.BAD_REQUEST);


    private final String reason;
    private final HttpStatus status;
}

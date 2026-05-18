package ru.ngtu.twosteps.common.exceptions.classes;

import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import ru.ngtu.twosteps.common.exceptions.reasons.ErrorReason;

import java.util.HashMap;
import java.util.Map;

/**
 * Base class for application exceptions.
 * Used as a response with error reason, message and details.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class AppException extends RuntimeException {
    private static final String MESSAGE_PLACEHOLDER = "App error: %s";

    private ErrorReason reason;
    private String message;
    private Map<String, Object> details = new HashMap<>();


    public AppException(ErrorReason reason, String message) {
        super(String.format(MESSAGE_PLACEHOLDER, message));
        this.reason = reason;
        this.message = message;
    }

    public AppException(ErrorReason reason, String message, Map<String, Object> details) {
        this(reason, message);
        this.details = details;
    }
}

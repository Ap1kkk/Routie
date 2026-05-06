package ru.ngtu.twosteps.common.exceptions.classes.security;

import lombok.Getter;
import ru.ngtu.twosteps.common.exceptions.classes.AppException;
import ru.ngtu.twosteps.common.exceptions.reasons.ErrorReason;

import java.util.Map;

/**
 * Exception class for security cases when access denied
 */
@Getter
public class PermissionException extends AppException {

    public PermissionException(ErrorReason reason, String message) {
        super(reason, message);
    }

    public PermissionException(ErrorReason reason, String message, Map<String, Object> details) {
        super(reason, message, details);
    }
}

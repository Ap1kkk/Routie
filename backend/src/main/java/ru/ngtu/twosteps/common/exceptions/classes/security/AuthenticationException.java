package ru.ngtu.twosteps.common.exceptions.classes.security;

import lombok.Getter;
import ru.ngtu.twosteps.common.exceptions.classes.AppException;
import ru.ngtu.twosteps.common.exceptions.reasons.DefaultErrorReason;
import ru.ngtu.twosteps.common.exceptions.reasons.ErrorReason;

/**
 * Exception class used for authentication errors
 * @author Egor Bokov
 */
@Getter
public class AuthenticationException extends AppException {
    public static final ErrorReason REASON = DefaultErrorReason.AUTHENTICATION_ERROR;
    public static final int STATUS_VALUE = REASON.getStatus().value();


    public AuthenticationException(String message) {
        super(REASON, message);
    }
}

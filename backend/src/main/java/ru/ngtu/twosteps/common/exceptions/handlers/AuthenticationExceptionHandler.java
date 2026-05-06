package ru.ngtu.twosteps.common.exceptions.handlers;

import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import ru.ngtu.twosteps.common.exceptions.JwtAuthenticationException;
import ru.ngtu.twosteps.common.exceptions.SecurityErrorReason;
import ru.ngtu.twosteps.common.exceptions.messages.AppExceptionMessage;
import ru.ngtu.twosteps.common.exceptions.reasons.DefaultErrorReason;

/**
 * Used for authentication exceptions handling
 * @author Egor Bokov
 */
@ControllerAdvice
@Order(AuthenticationExceptionHandler.ORDER)
public class AuthenticationExceptionHandler extends BaseExceptionHandler {
    public static final int ORDER = 0;


    @ExceptionHandler
    public ResponseEntity<AppExceptionMessage> handle(AuthenticationException e) {
        return buildAppException(
                DefaultErrorReason.AUTHENTICATION_ERROR,
                e.getMessage()
        );
    }

    @ExceptionHandler
    public ResponseEntity<AppExceptionMessage> handle(JwtAuthenticationException e) {
        return buildAppException(SecurityErrorReason.JWT_EXPIRED, e.getMessage());
    }
}

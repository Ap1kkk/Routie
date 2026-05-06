package ru.ngtu.twosteps.common.exceptions.handlers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import ru.ngtu.twosteps.common.exceptions.classes.validation.ValidationException;
import ru.ngtu.twosteps.common.exceptions.messages.AppExceptionMessage;

/**
 * Exception handler for validation-related exceptions
 */
@Slf4j
@ControllerAdvice
@Order(ValidationExceptionHandler.ORDER)
public class ValidationExceptionHandler extends BaseExceptionHandler {
    public static final int ORDER = 0;


    @ExceptionHandler
    public ResponseEntity<AppExceptionMessage> handle(ValidationException e) {
        return buildAppException(e);
    }
}

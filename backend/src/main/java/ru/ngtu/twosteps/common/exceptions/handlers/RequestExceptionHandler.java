package ru.ngtu.twosteps.common.exceptions.handlers;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import ru.ngtu.twosteps.common.exceptions.messages.AppExceptionMessage;
import ru.ngtu.twosteps.common.exceptions.reasons.DefaultErrorReason;

import java.nio.file.AccessDeniedException;

/**
 * Exception handler for request-related exceptions
 */
@ControllerAdvice
@Order(RequestExceptionHandler.ORDER)
public class RequestExceptionHandler extends BaseExceptionHandler {
    public static final int ORDER = 0;


    @ExceptionHandler
    public ResponseEntity<AppExceptionMessage> handle(MissingServletRequestParameterException e) {
        return buildAppException(e, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    public ResponseEntity<AppExceptionMessage> handle(HttpMediaTypeNotSupportedException e) {
        return buildAppException(DefaultErrorReason.UNSUPPORTED_MEDIA_TYPE, e.getMessage());
    }

    @ExceptionHandler()
    public ResponseEntity<AppExceptionMessage> handle(HttpRequestMethodNotSupportedException e) {
        return buildAppException(DefaultErrorReason.METHOD_NOT_ALLOWED, e.getMessage());
    }

    @ExceptionHandler()
    public ResponseEntity<AppExceptionMessage> handle(AccessDeniedException e) {
        return buildAppException(DefaultErrorReason.ACCESS_DENIED, e.getMessage());
    }

    @ExceptionHandler
    public ResponseEntity<AppExceptionMessage> handle(NoResourceFoundException e) {
        return buildAppException(DefaultErrorReason.NOT_FOUND, e.getMessage());
    }
}

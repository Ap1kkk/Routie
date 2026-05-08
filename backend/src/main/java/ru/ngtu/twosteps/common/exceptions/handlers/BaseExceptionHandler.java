package ru.ngtu.twosteps.common.exceptions.handlers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ru.ngtu.twosteps.common.exceptions.classes.AppException;
import ru.ngtu.twosteps.common.exceptions.messages.AppExceptionMessage;
import ru.ngtu.twosteps.common.exceptions.reasons.ErrorReason;

import java.util.Map;

/**
 * Base class for exception handlers with response build methods
 */
@Slf4j
public abstract class BaseExceptionHandler {

    protected ResponseEntity<AppExceptionMessage> buildAppException(Throwable e, HttpStatus status) {
        return buildAppException(e.getMessage(), status);
    }

    protected ResponseEntity<AppExceptionMessage> buildAppException(String message, HttpStatus status) {
        log.error("[http: {}] : {}", status, message);
        return new ResponseEntity<>(new AppExceptionMessage(status, message), status);
    }

    protected ResponseEntity<AppExceptionMessage> buildAppException(AppException e) {
        log.error("{} : {}", e.getReason(), e.toString());
        HttpStatus status = e.getReason().getStatus();
        return new ResponseEntity<>(new AppExceptionMessage(e.getReason(), e.getMessage(), e.getDetails()), status);
    }

    protected ResponseEntity<AppExceptionMessage> buildAppException(ErrorReason errorReason, String message) {
        log.error("{} : {}", errorReason, message);
        HttpStatus status = errorReason.getStatus();
        return new ResponseEntity<>(new AppExceptionMessage(errorReason, message), status);
    }

    protected ResponseEntity<AppExceptionMessage> buildAppException(ErrorReason errorReason, String message, Map<String, Object> details) {
        log.error("{} : {}. Details: {}", errorReason, message, details);
        HttpStatus status = errorReason.getStatus();
        return new ResponseEntity<>(new AppExceptionMessage(errorReason, message, details), status);
    }
}
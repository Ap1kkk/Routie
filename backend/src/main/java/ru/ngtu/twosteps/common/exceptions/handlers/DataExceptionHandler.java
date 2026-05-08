package ru.ngtu.twosteps.common.exceptions.handlers;

import org.springframework.core.annotation.Order;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.NonTransientDataAccessException;
import org.springframework.dao.RecoverableDataAccessException;
import org.springframework.dao.TransientDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.datasource.init.ScriptException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import ru.ngtu.twosteps.common.exceptions.classes.data.DataException;
import ru.ngtu.twosteps.common.exceptions.messages.AppExceptionMessage;

/**
 * Exception handler for data-access exceptions
 */
@ControllerAdvice
@Order(DataExceptionHandler.ORDER)
public class DataExceptionHandler extends BaseExceptionHandler {
    public static final int ORDER = 0;


    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<AppExceptionMessage> handle(DataAccessException e) {
        return buildAppException("Data access error: " + e.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(RecoverableDataAccessException.class)
    public ResponseEntity<AppExceptionMessage> handle(RecoverableDataAccessException e) {
        return buildAppException("Recoverable data access error", HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(NonTransientDataAccessException.class)
    public ResponseEntity<AppExceptionMessage> handle(NonTransientDataAccessException e) {
        return buildAppException("Non transient data access error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ScriptException.class)
    public ResponseEntity<AppExceptionMessage> handle(ScriptException e) {
        return buildAppException("Script data access error", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TransientDataAccessException.class)
    public ResponseEntity<AppExceptionMessage> handle(TransientDataAccessException e) {
        return buildAppException("Transient data access error", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    public ResponseEntity<AppExceptionMessage> handle(DataException e) {
        return buildAppException(e);
    }
}
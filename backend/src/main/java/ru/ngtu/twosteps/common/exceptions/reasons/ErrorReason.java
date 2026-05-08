package ru.ngtu.twosteps.common.exceptions.reasons;

import org.springframework.http.HttpStatus;
import ru.ngtu.twosteps.common.exceptions.messages.AppExceptionMessage;

/**
 * Used as error reason in {@link AppExceptionMessage application error message}
 */
public interface ErrorReason {
    String getReason();
    HttpStatus getStatus();
}

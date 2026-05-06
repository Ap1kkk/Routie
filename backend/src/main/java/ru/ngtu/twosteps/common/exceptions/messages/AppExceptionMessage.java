package ru.ngtu.twosteps.common.exceptions.messages;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.http.HttpStatus;
import ru.ngtu.twosteps.common.exceptions.reasons.ErrorReason;

import java.util.Map;

/**
 * Message class used to display formatted error message
 */
@Data
@SuperBuilder
@NoArgsConstructor
public class AppExceptionMessage {
    private int status;
    private String reason;
    private String message;
    private Map<String, Object> details;


    public AppExceptionMessage(HttpStatus status, String message) {
        this.message = message;
        this.status = status.value();
    }

    public AppExceptionMessage(ErrorReason reason) {
        this.status = reason.getStatus().value();
        this.reason = reason.getReason();
    }

    public AppExceptionMessage(ErrorReason reason, String message) {
        this(reason);
        this.message = message;
    }

    public AppExceptionMessage(ErrorReason reason, Map<String, Object> details) {
        this(reason);
        this.details = details;
    }

    public AppExceptionMessage(ErrorReason reason, String message, Map<String, Object> details) {
        this(reason, message);
        this.details = details;
    }
}

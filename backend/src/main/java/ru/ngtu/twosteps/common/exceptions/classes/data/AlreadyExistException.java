package ru.ngtu.twosteps.common.exceptions.classes.data;

import lombok.Getter;
import ru.ngtu.twosteps.common.exceptions.reasons.DefaultErrorReason;
import ru.ngtu.twosteps.common.exceptions.reasons.ErrorReason;

import java.util.Map;

/**
 * Exception class for cases when entity already exists
 * @author Egor Bokov
 */
@Getter
public class AlreadyExistException extends DataException {
    private static final String MESSAGE_PLACEHOLDER = "%s already exists with id: %s";


    public AlreadyExistException(ErrorReason reason, String message) {
        super(reason, message);
    }

    public AlreadyExistException(ErrorReason reason, String message, Map<String, Object> details) {
        super(reason, message, details);
    }

    /**
     * Message will be written in format:
     * {@code [Class] already exists with id: [id]}
     */
    public AlreadyExistException(Class<?> clazz, Long id) {
        super(DefaultErrorReason.NOT_FOUND, String.format(MESSAGE_PLACEHOLDER, clazz.getSimpleName(), id));
    }
}

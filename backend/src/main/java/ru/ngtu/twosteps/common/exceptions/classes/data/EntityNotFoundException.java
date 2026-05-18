package ru.ngtu.twosteps.common.exceptions.classes.data;

import lombok.Getter;
import ru.ngtu.twosteps.common.exceptions.reasons.DefaultErrorReason;
import ru.ngtu.twosteps.common.exceptions.reasons.ErrorReason;

import java.util.Map;
import java.util.Set;

/**
 * Exception class for cases when entity was not found
 */
@Getter
public class EntityNotFoundException extends DataException {

    private static final String MESSAGE_ID_FORMAT = "%s cannot be found by id: %s";
    private static final String MESSAGE_IDS_FORMAT = "%s cannot be found. Missing ids: %s";
    private static final String MESSAGE_FORMAT = "%s cannot be found %s";

    public EntityNotFoundException(ErrorReason reason, String message, Map<String, Object> details) {
        super(reason, message, details);
    }

    public EntityNotFoundException(Class<?> clazz, Set<Long> missingIds) {
        super(DefaultErrorReason.NOT_FOUND, MESSAGE_IDS_FORMAT.formatted(clazz.getSimpleName(), missingIds.toString()));
    }

    /**
     * Message will be written in format:
     * {@code [Class] cannot be found by id: [id]}
     */
    public EntityNotFoundException(Class<?> clazz, Long id) {
        super(DefaultErrorReason.NOT_FOUND, String.format(MESSAGE_ID_FORMAT, clazz.getSimpleName(), id));
    }

    /**
     * Message will be written in format:
     * {@code [Class] cannot be found by id: [id]}
     */
    public EntityNotFoundException(Class<?> clazz, Long id, Map<String, Object> details) {
        super(DefaultErrorReason.NOT_FOUND, String.format(MESSAGE_ID_FORMAT, clazz.getSimpleName(), id), details);
    }

    /**
     * Message will be written in format:
     * {@code [Class] cannot be found [reason]}
     */
    public EntityNotFoundException(Class<?> clazz, String reason) {
        super(DefaultErrorReason.NOT_FOUND, String.format(MESSAGE_FORMAT, clazz.getSimpleName(), reason));
    }

    /**
     * Message will be written in format:
     * {@code [Class] cannot be found [reason]}
     */
    public EntityNotFoundException(Class<?> clazz, String reason, Map<String, Object> details) {
        super(DefaultErrorReason.NOT_FOUND, String.format(MESSAGE_FORMAT, clazz.getSimpleName(), reason), details);
    }
}

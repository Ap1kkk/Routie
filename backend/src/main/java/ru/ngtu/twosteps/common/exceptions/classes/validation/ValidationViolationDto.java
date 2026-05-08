package ru.ngtu.twosteps.common.exceptions.classes.validation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.experimental.SuperBuilder;

import java.util.Map;

/**
 * Dto class which used in violations list in error response details
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationViolationDto {
    private String field;
    private String message;
    private Object value;
    @JsonIgnore
    private ValidationErrorType errorType;
    private Map<String, Object> constraints;


    public ValidationViolationDto(String field, ValidationErrorType errorType, String message) {
        this.field = field;
        this.message = message;
        this.errorType = errorType;
    }

    public ValidationViolationDto(String field, Object value, ValidationErrorType errorType, String message) {
        this(field, errorType, message);
        this.value = value;
    }

    public ValidationViolationDto(String field, Object value, ValidationErrorType errorType, String message, Map<String, Object> constraints) {
        this(field, value, errorType, message);
        this.constraints = constraints;
    }

    /**
     * Creates new instance of {@link ValidationViolationDto}.
     * Message set in format: {@code [messageStart] must not be null}.
     * Validation error type set as {@code DefaultValidationErrorTypes.REQUIRED_FIELD_NOT_PRESENT}
     * @return new instance of {@link ValidationViolationDto}
     */
    public static ValidationViolationDto requiredIsNull(@NonNull String field, @NonNull String messageStart) {
        String message = String.format("%s must not be null", messageStart);

        return new ValidationViolationDto(field, DefaultValidationErrorType.REQUIRED_FIELD_NOT_PRESENT, message);
    }

    @JsonProperty("errorType")
    public String getErrorType() {
        return errorType.getType();
    }
}

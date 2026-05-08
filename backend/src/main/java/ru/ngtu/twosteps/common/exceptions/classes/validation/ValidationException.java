package ru.ngtu.twosteps.common.exceptions.classes.validation;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import ru.ngtu.twosteps.common.exceptions.classes.data.DataException;
import ru.ngtu.twosteps.common.exceptions.reasons.DefaultErrorReason;
import ru.ngtu.twosteps.common.exceptions.reasons.ErrorReason;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Exception class for cases when data validation failed
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ValidationException extends DataException {

    public ValidationException(ErrorReason reason, String message) {
        super(reason, message, new HashMap<>());
    }

    public ValidationException(ErrorReason reason, String message, Map<String, Object> details) {
        super(reason, message, details);
    }

    public static Builder builder() {
        return new ValidationException().new Builder();
    }

    public Builder getBuilder() {
        return this.new Builder();
    }


    /**
     * Builder class as an implementation of Builder Pattern for exception.
     */
    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public class Builder {
        private static final String VIOLATIONS_KEY = "violations";
        private final List<ValidationViolationDto> violations = new ArrayList<>();


        /**
         * Adds dto in details violations list.
         * @param dto will be added in violations details
         * @return this {@link Builder} instance
         */
        public Builder addViolation(ValidationViolationDto dto) {
            violations.add(dto);
            return this;
        }

        /**
         * Adds details key-value pair
         * @return this {@link Builder} instance
         */
        public Builder addDetails(String key, Object value) {
            ValidationException.this.getDetails().put(key, value);
            return this;
        }

        /**
         * Sets message value
         * @return this {@link Builder} instance
         */
        public Builder message(@NonNull String message) {
            ValidationException.this.setMessage(message);
            return this;
        }

        /**
         * @return {@code true} - if violations list is not empty
         */
        public boolean hasViolations() {
            return !violations.isEmpty();
        }

        /**
         * Applies earlier given values to exception and returns new instance.
         * {@code DefaultErrorReason.VALIDATION_FAILED} - set as error reason
         * @return instance of {@link ValidationException} with applied values
         */
        public ValidationException build() {
            ValidationException.this.setReason(DefaultErrorReason.VALIDATION_FAILED);
            if(hasViolations())
                ValidationException.this.getDetails().put(VIOLATIONS_KEY, violations);
            return ValidationException.this;
        }

        /**
         * Applies earlier given values to exception and returns new instance
         * @param errorReason sets exception error reason
         * @return instance of {@link ValidationException} with applied values
         */
        public ValidationException build(ErrorReason errorReason) {
            ValidationException.this.setReason(errorReason);
            if(hasViolations())
                ValidationException.this.getDetails().put(VIOLATIONS_KEY, violations);
            return ValidationException.this;
        }

        /**
         * Applies earlier given values to exception and returns new instance
         * {@code DefaultErrorReason.VALIDATION_FAILED} - set as error reason
         * @param details sets given details
         * @return instance of {@link ValidationException} with applied values
         */
        public ValidationException build(Map<String, Object> details) {
            ValidationException.this.setReason(DefaultErrorReason.VALIDATION_FAILED);
            ValidationException.this.setDetails(details);
            return ValidationException.this;
        }
    }
}

package ru.ngtu.twosteps.common.exceptions.classes.validation;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Default set of {@link ValidationErrorType validation error types}
 */
@Getter
@RequiredArgsConstructor
public enum DefaultValidationErrorType implements ValidationErrorType {
    CONSTRAINT_VIOLATION("constraint_violation"),
    WRONG_VALUE("wrong_value"),
    REQUIRED_FIELD_NOT_PRESENT("required_field_not_present"),
    UNIQUE_VIOLATION("unique_violation"),;


    private final String type;
}

package ru.ngtu.twosteps.common.exceptions.classes;


import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.twosteps.common.utils.StringUtils;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationError {

  public static final String INVALID_BOOLEAN_VALUE = "Invalid boolean value";
  public static final String INVALID_INT_VALUE = "Invalid int value";
  public static final String INVALID_DECIMAL_VALUE = "Invalid decimal value";
  public static final String MUST_NOT_BE_EMPTY = "Must not be empty";
  public static final String NOT_ARRAY_DEFAULT_VALUE = "Param marked as array, but has not array default value";
  public static final String SIZE_FROM_PARAM_MUST_BE_INTEGER = "Related size from param must be integer";
  public static final String NOT_ALL_INNER_PARAMS_ARE_FEATURE = "Not all inner params are feature";
  public static final String FEATURE_MUST_BE_ARRAY = "Feature must be array";
  public static final String INVALID_FEATURE_TYPE = "Feature type must be integer or decimal";
  //  private String field;
  private String message;
  private Object value;

  public static ValidationError notFoundById(Class<?> clazz, Object id) {
    return ValidationError.builder()
        .message("Invalid id (%s). No %s found"
            .formatted(id, StringUtils.formatClassName(clazz)))
        .value(id)
        .build();
  }

  public static ValidationError notFound(EntityNotFoundException exception) {
    return ValidationError.builder()
        .message(exception.getMessage())
        .value(exception.getValue())
        .build();
  }

  public static ValidationError fromPattern(Object value, String pattern, Object... args) {
    return ValidationError.builder()
        .message(pattern.formatted(args))
        .value(value)
        .build();
  }

  public static ValidationError regexMismatch(String value, String regex) {
    return ValidationError.builder()
        .message("Pattern mismatch: %s".formatted(regex))
        .value(value)
        .build();
  }

  public static ValidationError constraintMismatch(Object value, Object constraint,
      String constraintName) {
    return ValidationError.builder()
        .message("Constraint '%s' mismatch: %s".formatted(constraintName, constraint))
        .value(value)
        .build();
  }

  public static ValidationError badBoolean(Object value) {
    return ValidationError.builder()
        .message(INVALID_BOOLEAN_VALUE)
        .value(value)
        .build();
  }

  public static ValidationError outOfValueSet(Object value, Set<?> valueSet) {
    return ValidationError.builder()
        .message("Value %s is not in set: %s".formatted(value, valueSet))
        .value(value)
        .build();
  }

  public static ValidationError invalidInt(Object value) {
    return ValidationError.builder()
        .message(INVALID_INT_VALUE)
        .value(value)
        .build();
  }

  public static ValidationError invalidDecimal(Object value) {
    return ValidationError.builder()
        .message(INVALID_DECIMAL_VALUE)
        .value(value)
        .build();
  }

  public static ValidationError mustNotBeEmpty() {
    return ValidationError.builder()
        .message(MUST_NOT_BE_EMPTY)
        .build();
  }

  public static ValidationError withMessage(String message) {
    return ValidationError.builder()
        .message(message)
        .build();
  }

  public static ValidationError notArrayDefaultValue() {
    return ValidationError.builder()
        .message(NOT_ARRAY_DEFAULT_VALUE)
        .build();
  }

  public static ValidationError invalidSizeFrom() {
    return ValidationError.builder()
        .message(SIZE_FROM_PARAM_MUST_BE_INTEGER)
        .build();
  }

  public static ValidationError notAllInnerParamsAreFeature() {
    return ValidationError.builder()
        .message(NOT_ALL_INNER_PARAMS_ARE_FEATURE)
        .build();
  }

  public static ValidationError featureMustBeArray() {
    return ValidationError.builder()
        .message(FEATURE_MUST_BE_ARRAY)
        .build();
  }

  public static ValidationError invalidFeatureType() {
    return ValidationError.builder()
        .message(INVALID_FEATURE_TYPE)
        .build();
  }

  public static ValidationError notAllEntitiesFound(Set<UUID> modelIds,
      Set<UUID> foundIds) {
    return ValidationError.builder()
        .message("Found %d entities instead of %d. Missing entities: %s".formatted(foundIds.size(),
            modelIds.size(), modelIds.stream().filter(id -> !foundIds.contains(id)).collect(
                Collectors.toSet())))
        .build();
  }

  public static ValidationError entityIsNotInactive(Class<?> clazz) {
    return ValidationError.builder()
        .message("%s is not active".formatted(StringUtils.formatClassName(clazz)))
        .build();
  }
}

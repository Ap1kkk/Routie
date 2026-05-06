package ru.ngtu.twosteps.common.exceptions.classes;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;

@Slf4j
@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class ValidationContext {

  private final Map<String, List<ValidationError>> errors = new HashMap<>();
  private final List<NestedValidationContext> nestedContexts = new ArrayList<>();

  @Builder.Default
  private boolean canRaise = true;
  @Builder.Default
  private boolean isValidationSkipped = false;
  private String currentKey;
  @Builder.Default
  private String fullPath = "";

  public static ValidationContext create() {
    return ValidationContext.builder().build();
  }

  public static ValidationContext skipped() {
    return ValidationContext.builder()
        .isValidationSkipped(true).build();
  }

  public ValidationContext skipThis() {
    isValidationSkipped = true;
    return this;
  }

  public ValidationContext ifEmpty(Runnable action) {
    if (isEmpty()) {
      action.run();
    }
    return this;
  }

  public boolean isEmpty() {
    return errors.isEmpty() && nestedContexts.isEmpty();
  }

  public boolean hasErrors() {
    return !isEmpty();
  }

  public void addError(ValidationError value) {
    errors.put(currentKey, new ArrayList<>(List.of(value)));
  }

  public void addError(String key, ValidationError value) {
    if (errors.containsKey(key)) {
      List<ValidationError> existingErrors = errors.get(key);
      existingErrors.add(value);
    } else {
      errors.put(key, new ArrayList<>(List.of(value)));
    }
  }

  public ValidationContext setCurrentKey(String key) {
    currentKey = key;
    return this;
  }

  public ValidationContext addNestedContext(String name) {
    NestedValidationContext nestedContext = new NestedValidationContext(name);
    nestedContext.setCanRaise(canRaise);
    nestedContexts.add(nestedContext);
    nestedContext.setFullPath(formatPath(fullPath, name));
    return nestedContext;
  }

  public Optional<? extends ValidationContext> getNestedContext(String name) {
    return nestedContexts.stream().filter(context -> context.getName().equals(name)).findFirst();
  }

  public void enableRaise() {
    canRaise = true;
  }

  public void disableRaise() {
    canRaise = false;
  }

  public void raiseIfHasErrors() {
    if (hasErrors()) {
      raise();
    }
  }

  public void raise() {
    if (mustRaise()) {
      forceRaise();
    }
  }

  public boolean mustRaise() {
    boolean nestedMustRaise = false;
    for (NestedValidationContext nestedContext : nestedContexts) {
      nestedMustRaise = nestedMustRaise || nestedContext.mustRaise();
    }
    if (nestedMustRaise) {
      return true;
    } else {
      return canRaise && !errors.isEmpty();
    }
  }

  public void forceRaise() {
    throw new ValidationException(this);
  }

  public boolean isSkipped() {
    return isValidationSkipped;
  }

  public List<ErrorDTO> buildErrors() {
    List<ErrorDTO> validationErrors = new ArrayList<>();
    addErrors(validationErrors, errors, fullPath);
    buildErrorsForNestedContexts(validationErrors, nestedContexts, fullPath);
    return validationErrors;
  }

  private void addErrors(List<ErrorDTO> validationErrors,
      Map<String, List<ValidationError>> errors, String parentPath) {
    errors.forEach((key, value) -> {
      value.forEach(error -> {
        validationErrors.add(ErrorDTO.builder()
            .errorMessage(error.getMessage())
            .details(List.of(ErrorDetailsDTO.builder()
                .pointer(formatPath(parentPath, key))
                .build()))
            .build());
      });
    });
  }

  private void buildErrorsForNestedContexts(List<ErrorDTO> validationErrors,
      List<NestedValidationContext> nestedContexts, String parentPath) {
    nestedContexts.forEach(nc -> buildErrorsForNestedContext(nc, validationErrors, parentPath));
  }

  private void buildErrorsForNestedContext(NestedValidationContext nc,
      List<ErrorDTO> validationErrors, String parentPath) {
    if (nc.hasErrors()) {
      String formattedPath = formatPath(parentPath, nc.getName());
      addErrors(validationErrors, nc.getErrors(), formattedPath);
      List<NestedValidationContext> nestedContexts = nc.getNestedContexts();
      if (nestedContexts != null) {
        buildErrorsForNestedContexts(validationErrors, nestedContexts, formattedPath);
      }
    }
  }

  private String formatPath(String left, String right) {
    if (Strings.isBlank(left)) {
      return right;
    }
    return "%s.%s".formatted(left, right);
  }
}

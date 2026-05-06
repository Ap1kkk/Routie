package ru.ngtu.twosteps.common.exceptions.classes;

import lombok.Getter;

@Getter
public class ValidationException extends RuntimeException {

  private final ValidationContext context;

  public ValidationException(ValidationContext context) {
    this.context = context;
  }
}

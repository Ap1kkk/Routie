package ru.ngtu.twosteps.common.exceptions.classes;

import lombok.Getter;

@Getter
public class BadArgumentsException extends RuntimeException {

  private final String errorMessage;
  private String errorDisplayMessage;

  public BadArgumentsException(String message) {
    super(message);
    this.errorMessage = message;
  }

  public BadArgumentsException(String message, String displayMessage) {
    super(message);
    this.errorMessage = message;
    this.errorDisplayMessage = displayMessage;
  }
}

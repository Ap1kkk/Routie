package ru.ngtu.twosteps.common.exceptions.classes;

import java.util.UUID;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class GenericErrorResponseDTO {

  private UUID errorId = UUID.randomUUID();
  private int httpStatusCode;
  private HttpStatus httpStatus;
  private String message;

  public GenericErrorResponseDTO(String message, HttpStatus status) {
    this.message = message;
    this.httpStatus = status;
    this.httpStatusCode = status.value();
  }
}

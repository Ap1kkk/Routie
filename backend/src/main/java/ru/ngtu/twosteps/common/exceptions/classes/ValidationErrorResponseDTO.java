package ru.ngtu.twosteps.common.exceptions.classes;

import java.util.List;
import java.util.Map;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class ValidationErrorResponseDTO extends GenericErrorResponseDTO {

  private Map<String, List<ValidationError>> validationErrors;

  public ValidationErrorResponseDTO() {
    super("Validation failed", HttpStatus.BAD_REQUEST);
  }
}

package ru.ngtu.twosteps.common.exceptions.classes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.twosteps.common.utils.StringUtils;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDTO {

  private String errorMessage;
  private String errorMessageDisplay;

  @Builder.Default
  @JsonInclude(Include.NON_EMPTY)
  private List<ErrorDetailsDTO> details = new ArrayList<>();

  public static ErrorDTO fromMessage(ErrorMessage errorMessage) {
    ErrorDTO errorDTO = new ErrorDTO();
    errorDTO.setErrorMessage(errorMessage.getErrorMessage());
    errorDTO.setErrorMessageDisplay(errorMessage.getErrorMessageDisplay());
    return errorDTO;
  }

  public static ErrorDTO fromNotFoundException(EntityNotFoundException e) {
    String className = StringUtils.formatClassName(e.getClazz());
    Object field = e.getField();
    Object value = e.getValue();
    return ErrorDTO.builder()
        .errorMessage(String.format(ErrorMessage.NOT_FOUND_BY.getErrorMessage(),
            className, field, value))
        .errorMessageDisplay(String.format(ErrorMessage.NOT_FOUND_BY.getErrorMessageDisplay(),
            className, field, value))
        .build();
  }

  @JsonIgnore
  public ErrorDTO addDetails(ErrorDetailsDTO dto) {
    details.add(dto);
    return this;
  }

  @JsonIgnore
  public ErrorDTO addDetails(Collection<ErrorDetailsDTO> dtos) {
    details.addAll(dtos);
    return this;
  }
}

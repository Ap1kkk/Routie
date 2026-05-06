package ru.ngtu.twosteps.common.exceptions.classes;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetailsDTO {

  private String pointer;
  private String description;
  private String descriptionDisplay;

  public static ErrorDetailsDTO ofPointer(String field) {
    ErrorDetailsDTO dto = new ErrorDetailsDTO();
    dto.setPointer(field);
    return dto;
  }

  public static ErrorDetailsDTO ofDescription(String description) {
    ErrorDetailsDTO dto = new ErrorDetailsDTO();
    dto.setDescription(description);
    return dto;
  }

//  public static ErrorDetailsDTO fromFormat(ErrorDescription errorDescription, Object... args) {
//    ErrorDetailsDTO dto = new ErrorDetailsDTO();
//    dto.setDescription(String.format(errorDescription.getDescription(), args));
//    dto.setDescriptionDisplay(String.format(errorDescription.getDescriptionDisplay(), args));
//    return dto;
//  }
}

package ru.ngtu.v1.routie.dto.common;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiError {

  private String code;
  private String message;
  private List<String> details;
  private LocalDateTime timestamp = LocalDateTime.now();
}
package ru.ngtu.v1.routie.dto.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiPageResponse<T> {

  private boolean success;
  private PageResponse<T> data;
  private ApiError error;
  private LocalDateTime timestamp;

  public ApiPageResponse(boolean success, PageResponse<T> data, ApiError apiError) {
    this.success = success;
    this.data = data;
    this.error = apiError;
  }
}

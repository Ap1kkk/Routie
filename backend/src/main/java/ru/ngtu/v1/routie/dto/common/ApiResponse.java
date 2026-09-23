package ru.ngtu.v1.routie.dto.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

  private boolean success;
  private T data;
  private ApiError error;
  private Instant timestamp = Instant.now();

  public static <T> ApiResponse<T> of(T body) {
    return new ApiResponse<>(true, body, null, Instant.now());
  }

  public static <T> ApiResponse<T> error(ApiError error) {
    return new ApiResponse<>(false, null, error, Instant.now());
  }

  public static ApiResponseVoid empty() {
    return new ApiResponseVoid();
  }
}
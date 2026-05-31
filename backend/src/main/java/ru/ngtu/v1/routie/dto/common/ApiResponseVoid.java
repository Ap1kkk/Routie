package ru.ngtu.v1.routie.dto.common;

import java.time.Instant;

public class ApiResponseVoid extends ApiResponse {

  public ApiResponseVoid() {
    super(true, null, null, Instant.now());
  }

}

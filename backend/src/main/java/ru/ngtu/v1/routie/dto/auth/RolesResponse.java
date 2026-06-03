package ru.ngtu.v1.routie.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RolesResponse {

  @Schema(example = "[\"USER\"]")
  private List<String> roles;
}
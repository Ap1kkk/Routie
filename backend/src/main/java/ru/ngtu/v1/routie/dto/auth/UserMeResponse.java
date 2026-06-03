package ru.ngtu.v1.routie.dto.auth;

import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserMeResponse {

  private UUID id;
  private String email;
  private String name;
  private String username;
  private List<String> roles;
}
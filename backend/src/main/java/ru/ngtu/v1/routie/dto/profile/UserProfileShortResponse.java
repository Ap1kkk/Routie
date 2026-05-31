package ru.ngtu.v1.routie.dto.profile;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileShortResponse {

  private UUID id;
  private String firstName;
  private String lastName;
  private String avatarUrl;
  private Integer currentLevel;
  private Integer totalXp;
  private String city;
  private Boolean isFriend;
}
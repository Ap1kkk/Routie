package ru.ngtu.v1.routie.dto.profile;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileShortResponse {

  private UUID id;
  private String firstName;
  private String lastName;
  private MediaFileResponse avatar;
  private Integer currentLevel;
  private Integer totalXp;
  private String city;
  private Boolean isFriend;
}
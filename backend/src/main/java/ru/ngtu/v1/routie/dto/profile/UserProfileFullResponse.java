package ru.ngtu.v1.routie.dto.profile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileFullResponse {

  private UUID id;
  private String email;
  private String name;
  private String username;
  private MediaFileResponse avatar;
  private LocalDate dateOfBirth;
  private Gender gender;
  private String city;
  private String favoriteSportType;
  private String preferredTransport;
  private Integer totalXp;
  private Integer currentLevel;
  private Integer totalDistanceMeters;
  private Integer totalRoutesCompleted;
  private Integer totalLandmarksVisited;
  private Boolean isFriend;
  private LocalDateTime createdAt;
}
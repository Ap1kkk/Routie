package ru.ngtu.v1.routie.dto.profile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.tag.TagResponse;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileFullResponse {

    private UUID id;
    private String email;
    private String username;
    private String name;
    private MediaFileResponse avatar;
    private LocalDate dateOfBirth;
    private Gender gender;
    private Integer height;
    private Integer weight;
    private List<TagResponse> preferredTags;
    private Integer totalXp;
    private Integer currentLevel;
    private Integer totalDistanceMeters;
    private Integer totalRoutesCompleted;
    private Integer totalLandmarksVisited;
    private Boolean isFriend;
    private LocalDateTime createdAt;
}

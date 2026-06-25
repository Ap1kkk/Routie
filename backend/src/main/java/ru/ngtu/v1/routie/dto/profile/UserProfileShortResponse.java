package ru.ngtu.v1.routie.dto.profile;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileShortResponse {

    private UUID id;
    private String name;
    private String username;
    private MediaFileResponse avatar;
    private Integer currentLevel;
    private Integer totalXp;
    private Boolean isFriend;
}

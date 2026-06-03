package ru.ngtu.v1.routie.dto.gamification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntry {

    private Integer rank;
    private UUID userId;
    private String name;
    private String username;
    private MediaFileResponse avatar;
    private Integer currentLevel;
    private Integer totalXp;
    private Integer periodXp;
}

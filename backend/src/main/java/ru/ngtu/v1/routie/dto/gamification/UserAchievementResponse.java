package ru.ngtu.v1.routie.dto.gamification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import ru.ngtu.v1.routie.dto.common.MediaFileResponse;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAchievementResponse {

    private UUID achievementId;
    private String title;
    private String description;
    private MediaFileResponse icon;
    private Integer xpReward;
    private Integer progress;
    private Integer targetValue;
    private Boolean isUnlocked;
    private Instant unlockedAt;
}

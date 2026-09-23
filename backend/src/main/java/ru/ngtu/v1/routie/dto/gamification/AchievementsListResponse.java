package ru.ngtu.v1.routie.dto.gamification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AchievementsListResponse {

    private List<UserAchievementResponse> achievements;
    private Integer totalUnlocked;
    private Integer totalAchievements;
}

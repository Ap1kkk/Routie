package ru.ngtu.v1.routie.dto.gamification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllAchievementsResponse {

    private List<AchievementResponse> achievements;
}

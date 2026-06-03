package ru.ngtu.v1.routie.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsOverviewResponse {

    private Integer totalUsers;
    private Integer activeUsersLast30Days;
    private Integer totalRoutesCompleted;
    private Long totalDistanceMeters;
    private Long totalXpEarned;
    private Float averageLevel;
}

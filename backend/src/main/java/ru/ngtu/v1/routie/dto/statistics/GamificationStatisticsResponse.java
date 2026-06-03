package ru.ngtu.v1.routie.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GamificationStatisticsResponse {

    private Long totalXpDistributed;
    private Float averageXpPerUser;

    /** Название самого популярного достижения */
    private String topAchievement;

    /** Ключ — номер уровня, значение — количество пользователей на этом уровне */
    private Map<Integer, Integer> usersByLevel;

    /** Период наибольшей активности (например, "MONTH") */
    private String mostPopularPeriod;
}

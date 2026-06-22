package ru.ngtu.v1.routie.dto.profile;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Статистика текущего пользователя за выбранный период (для экрана профиля)")
public class UserStatisticsResponse {

    @Schema(description = "Начало периода (null, если startDate/endDate не передавались — статистика за всё время)")
    private LocalDate periodStart;

    @Schema(description = "Конец периода (null, если startDate/endDate не передавались — статистика за всё время)")
    private LocalDate periodEnd;

    @Schema(description = "Кол-во завершённых маршрутов за период")
    private Integer totalRoutesCompleted;

    @Schema(description = "Кол-во прерванных сессий за период")
    private Integer totalSessionsAborted;

    @Schema(description = "Суммарное время прохождения маршрутов за период, секунды")
    private Long totalDurationSeconds;

    @Schema(description = "Суммарная пройденная дистанция за период, метры")
    private Integer totalDistanceMeters;

    @Schema(description = "Приблизительное кол-во шагов за период (оценка по дистанции, шаг ~0.75м)")
    private Long estimatedTotalSteps;

    @Schema(description = "Кол-во пройденных точек маршрута (чекпоинтов) за период")
    private Long totalCheckpointsReached;

    @Schema(description = "Среднее время прохождения одного маршрута за период, секунды")
    private Double avgSessionDurationSeconds;

    @Schema(description = "Средняя длина пройденного маршрута за период, метры")
    private Double avgRouteLengthMeters;

    @Schema(description = "Средняя скорость прохождения за период, км/ч")
    private Double avgSpeedKmh;
}

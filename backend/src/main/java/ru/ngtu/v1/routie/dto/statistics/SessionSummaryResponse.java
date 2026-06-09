package ru.ngtu.v1.routie.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionSummaryResponse {

    private long totalSessions;
    private long finishedCount;
    private long abortedCount;
    private long activeCount;

    /** Процент завершённых от (finished + aborted), null если нет данных */
    private Double completionRate;

    private Double avgDurationSeconds;
    private Double avgSpeedKmh;
    private Double avgDistanceMeters;
}

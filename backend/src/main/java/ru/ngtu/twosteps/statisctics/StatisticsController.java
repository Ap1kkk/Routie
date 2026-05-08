package ru.ngtu.twosteps.statisctics;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * @author Egor Bokov
 */
@RestController
@RequestMapping("/api/v1/user/statistics")
@RequiredArgsConstructor
@Tag(name = "Statistics", description = "Statistics endpoints")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @PostMapping
    public StatisticsDto get(@RequestParam StatisticsPeriod period) {
        return statisticsService.getStatistics(period);
    }
}

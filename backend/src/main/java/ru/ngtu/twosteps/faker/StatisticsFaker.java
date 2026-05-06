package ru.ngtu.twosteps.faker;

import lombok.RequiredArgsConstructor;
import net.datafaker.Faker;
import org.springframework.stereotype.Component;
import ru.ngtu.twosteps.statisctics.StatisticsDto;

/**
 * @author Egor Bokov
 */
@Component
@RequiredArgsConstructor
public class StatisticsFaker {

    private final Faker faker = new Faker();

    public StatisticsDto getDto() {
        return StatisticsDto
                .builder()
                .totalDistance(faker.random().nextLong(100_000_000L))
                .totalSteps(faker.random().nextLong(100_000_000L))
                .totalDuration(faker.random().nextLong(100_000_000L))
                .totalCheckpoints(faker.random().nextLong(100_000_000L))
                .averageRouteDistance(faker.random().nextLong(1_000_000L))
                .averageRouteDuration(faker.random().nextLong(100_000L))
                .favouriteRoutesCount(faker.random().nextInt(100_000))
                .travelledRoutesCount(faker.random().nextInt(100_000_000))
                .build();
    }
}

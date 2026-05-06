package ru.ngtu.twosteps.faker;

import lombok.RequiredArgsConstructor;
import net.datafaker.Faker;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import ru.ngtu.twosteps.achievement.AchievementDto;

/**
 * @author Egor Bokov
 */
@Component
@RequiredArgsConstructor
public class AchievementFaker {

    private final Faker faker = new Faker();

    public AchievementDto getDto() {
        return AchievementDto
                .builder()
                .id(faker.random().nextLong())
                .name(faker.lorem().characters(10, 20))
                .description(faker.lorem().paragraph())
                .progress(faker.random().nextLong(100L))
                .goal(faker.random().nextLong(100L, 150L))
                .build();
    }

    public List<AchievementDto> getDto(int min, int max) {
        List<AchievementDto> checkpoints = new ArrayList<>();
        for (int i = 0; i < faker.random().nextInt(min, max); i++) {
            checkpoints.add(getDto());
        }
        return checkpoints;
    }
}

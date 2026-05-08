package ru.ngtu.twosteps.faker;

import lombok.RequiredArgsConstructor;
import net.datafaker.Faker;
import org.springframework.stereotype.Component;
import ru.ngtu.twosteps.jpa.entity.route.Route;
import ru.ngtu.twosteps.jpa.entity.route.RouteDifficulty;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Egor Bokov
 */
@Component
@RequiredArgsConstructor
public class RouteFaker {

    private final Faker faker = new Faker();
    private final ImageFaker imageFaker;
    private final CheckpointFaker checkpointFaker;
    private final CategoryFaker categoryFaker;

    public Route get() {
        return Route
                .builder()
                .id(faker.random().nextLong())
                .name(faker.lorem().characters(10, 30))
                .description(faker.lorem().paragraph())
                .difficulty(RouteDifficulty.values()[faker.random().nextInt(RouteDifficulty.values().length)])
                .distance(faker.random().nextLong(10000L))
                .duration(faker.random().nextLong(10000L))
//                .image(imageFaker.get())
                .checkpoints(checkpointFaker.get(3, 5))
                .categories(categoryFaker.get(2, 4))
                .build();
    }

    public List<Route> get(int min, int max) {
        List<Route> checkpoints = new ArrayList<>();
        for (int i = 0; i < faker.random().nextInt(min, max); i++) {
            checkpoints.add(get());
        }
        return checkpoints;
    }
}

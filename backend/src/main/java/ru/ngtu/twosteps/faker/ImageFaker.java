package ru.ngtu.twosteps.faker;

import net.datafaker.Faker;
import org.springframework.stereotype.Component;

import java.util.UUID;
import ru.ngtu.twosteps.jpa.entity.Image;

/**
 * @author Egor Bokov
 */
@Component
public class ImageFaker {

    private final Faker faker = new Faker();

    public Image get() {
        return Image
                .builder()
                .id(UUID.randomUUID())
                .path(faker.lorem().characters(30, 40))
                .displayOrder(faker.random().nextInt())
                .build();
    }
}

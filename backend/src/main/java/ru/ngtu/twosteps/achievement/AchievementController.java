package ru.ngtu.twosteps.achievement;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import ru.ngtu.twosteps.faker.AchievementFaker;

/**
 * @author Egor Bokov
 */
@RestController
@RequestMapping("/api/v1/user/achievements")
@RequiredArgsConstructor
@Tag(name = "Achievements", description = "Achievements endpoints")
public class AchievementController {

    private final AchievementFaker achievementFaker;

    @GetMapping
    public List<AchievementDto> getAll() {
        return achievementFaker.getDto(5, 15);
    }
}

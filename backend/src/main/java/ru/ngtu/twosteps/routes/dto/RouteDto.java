package ru.ngtu.twosteps.routes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.twosteps.jpa.entity.Checkpoint;
import ru.ngtu.twosteps.jpa.entity.route.Route;
import ru.ngtu.twosteps.jpa.entity.route.RouteDifficulty;

import java.util.List;

/**
 * DTO for {@link Route}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RouteDto {
    private Long id;
    private String name;
    private String description;
    private RouteDifficulty difficulty;
    private Long distance;
    private Long duration;
    private List<Long> categoryIds;
    private List<Checkpoint> checkpoints;
    private MultipartFile image;
}
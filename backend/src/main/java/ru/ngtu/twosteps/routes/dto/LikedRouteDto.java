package ru.ngtu.twosteps.routes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.twosteps.jpa.entity.route.Route;

/**
 * @author Egor Bokov
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LikedRouteDto {
    private boolean isLikedByCurrentUser;
    private Route route;
}

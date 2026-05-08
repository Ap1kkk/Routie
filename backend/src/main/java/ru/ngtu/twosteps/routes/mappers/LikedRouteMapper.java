package ru.ngtu.twosteps.routes.mappers;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import ru.ngtu.twosteps.jpa.BaseEntity;
import ru.ngtu.twosteps.routes.dto.LikedRouteDto;
import ru.ngtu.twosteps.jpa.entity.route.Route;
import ru.ngtu.twosteps.jpa.entity.user.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author Egor Bokov
 */
@Component
@RequiredArgsConstructor
public class LikedRouteMapper {

    public List<LikedRouteDto> map(List<Route> routes, User currentUser) {
        Set<Long> likedIds = currentUser.getFavouriteRoutes().stream().map(BaseEntity::getId).collect(Collectors.toSet());
        List<LikedRouteDto> target = new ArrayList<>();
        for (Route route : routes) {
            target.add(map(route, likedIds));
        }
        return target;
    }

    public LikedRouteDto map(Route route, Set<Long> likedIds) {
        return LikedRouteDto
                .builder()
                .route(route)
                .isLikedByCurrentUser(likedIds.contains(route.getId()))
                .build();
    }
}

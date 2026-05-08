package ru.ngtu.twosteps.routes.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.twosteps.auth.AuthService;
import ru.ngtu.twosteps.jpa.BaseEntity;
import ru.ngtu.twosteps.jpa.entity.route.history.HistoryRouteSpecification;
import ru.ngtu.twosteps.jpa.entity.route.RouteFilter;
import ru.ngtu.twosteps.jpa.entity.route.RouteFilterOrder;
import ru.ngtu.twosteps.jpa.entity.route.Route;
import ru.ngtu.twosteps.jpa.entity.route.RouteDifficulty;
import ru.ngtu.twosteps.jpa.entity.route.history.HistoryRoute;
import ru.ngtu.twosteps.jpa.repository.HistoryRouteRepository;
import ru.ngtu.twosteps.jpa.entity.route.history.HistoryRouteStatus;
import ru.ngtu.twosteps.common.exceptions.classes.data.EntityNotFoundException;
import ru.ngtu.twosteps.common.exceptions.classes.validation.ValidationException;
import ru.ngtu.twosteps.jpa.repository.user.UserRepository;
import ru.ngtu.twosteps.user.achievements.UserAchievementService;
import ru.ngtu.twosteps.jpa.entity.user.User;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Egor Bokov
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserRouteService {

    private final AuthService authService;

    private final UserRepository userRepository;
    private final UserAchievementService userAchievementService;

    private final RouteService routeService;
    private final HistoryRouteRepository historyRouteRepository;

    @Transactional
    public void likeRoute(Long routeId) {
        User currentUser = authService.getCurrentUser();
        log.debug("[User] : user [{}] like route [{}]", currentUser.getId(), routeId);

        userRepository.loadWithFavouriteRoutes(currentUser.getId());

        if(currentUser.getFavouriteRoutes().stream().map(BaseEntity::getId).anyMatch(routeId::equals))
            return;

        Route route = routeService.getById(routeId);
        currentUser.addRoute(route);
        route.setLikes(route.getLikes() + 1);

        userRepository.save(currentUser);
    }

    @Transactional
    public void unlikeRoute(Long routeId) {
        User currentUser = authService.getCurrentUser();
        log.debug("[User] : user [{}] unlike route [{}]", currentUser.getId(), routeId);

        userRepository.loadWithFavouriteRoutes(currentUser.getId());

        if(currentUser.getFavouriteRoutes().stream().map(BaseEntity::getId).noneMatch(routeId::equals))
            return;

        Route route = routeService.getById(routeId);
        currentUser.removeRoute(route);
        long updatedLikes = route.getLikes() - 1;
        route.setLikes(updatedLikes > 0 ? updatedLikes : 0);

        userRepository.save(currentUser);
        routeService.save(route);
    }


    public HistoryRoute start(Long routeId) {
        User currentUser = authService.getCurrentUser();
        Route route = routeService.getById(routeId);

        return historyRouteRepository.save(HistoryRoute
                .builder()
                        .user(currentUser)
                        .route(route)
                        .status(HistoryRouteStatus.STARTED)
                .build()
        );
    }

    public HistoryRoute leave(Long historyId) {
        return historyRouteRepository.save(updateStatus(historyId, HistoryRouteStatus.LEAVED));
    }

    @Transactional
    public HistoryRoute finish(Long historyId) {
        HistoryRoute historyRoute = updateStatus(historyId, HistoryRouteStatus.FINISHED);

        ZonedDateTime now = ZonedDateTime.now();
        historyRoute.setFinishedAt(now);
        historyRoute.setDelta(Duration.between(historyRoute.getStartedAt(), now));

        historyRouteRepository.saveAndFlush(historyRoute);

        userAchievementService.handleAchievements(historyRoute);

        return historyRoute;
    }

    private HistoryRoute updateStatus(Long historyId, HistoryRouteStatus status) {
        HistoryRoute historyRoute = historyRouteRepository.findById(historyId)
                .orElseThrow(() -> new EntityNotFoundException(HistoryRoute.class, historyId));

        HistoryRouteStatus routeStatus = historyRoute.getStatus();
        if(!routeStatus.equals(HistoryRouteStatus.STARTED))
            throw ValidationException.builder().message("Invalid history route status. Status must be STARTED, but it was: %s".formatted(routeStatus)).build();

        historyRoute.setStatus(status);

        return historyRoute;
    }

    public List<Route> getHistory(RouteFilter filter) {
        return historyRouteRepository.findAll(HistoryRouteSpecification.withFilters(filter))
                .stream()
                .map(HistoryRoute::getRoute)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<Route> getFavourite(RouteFilter filter) {
        User currentUser = authService.getCurrentUser();

        return currentUser.getFavouriteRoutes().stream()
                .filter(route -> filterByDifficulty(route, filter.getDifficulties()))
                .filter(route -> filterByCategory(route, filter.getCategoryIds()))
                .filter(route -> filterByDuration(route, filter.getDurationFrom(), filter.getDurationTo()))
                .filter(route -> filterByDistance(route, filter.getDistanceFrom(), filter.getDistanceTo()))
                .sorted((r1, r2) -> sortByDate(r1, r2, filter.getOrder()))
                .collect(Collectors.toList());
    }

    private boolean filterByDifficulty(Route route, List<RouteDifficulty> difficulties) {
        return difficulties == null || difficulties.isEmpty() || difficulties.contains(route.getDifficulty());
    }

    private boolean filterByCategory(Route route, List<Long> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) return true; // Нет фильтра по категориям
        if (route.getCategories() == null || route.getCategories().isEmpty()) return false; // У маршрута нет категорий

        List<Long> routeCategoryIds = route.getCategories().stream()
                .map(BaseEntity::getId)
                .collect(Collectors.toList());

        // Проверяем, есть ли пересечение категорий
        return routeCategoryIds.stream().anyMatch(categoryIds::contains);
    }

    private boolean filterByDuration(Route route, Long durationFrom, Long durationTo) {
        if (durationFrom != null && route.getDuration() < durationFrom) return false;
        if (durationTo != null && route.getDuration() > durationTo) return false;
        return true;
    }

    private boolean filterByDistance(Route route, Long distanceFrom, Long distanceTo) {
        if (distanceFrom != null && route.getDistance() < distanceFrom) return false;
        if (distanceTo != null && route.getDistance() > distanceTo) return false;
        return true;
    }

    private int sortByDate(Route r1, Route r2, RouteFilterOrder order) {
        if (order == null || order == RouteFilterOrder.ASC) {
            return r1.getCreatedAt().compareTo(r2.getCreatedAt());
        } else {
            return r2.getCreatedAt().compareTo(r1.getCreatedAt());
        }
    }
}

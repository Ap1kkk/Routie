package ru.ngtu.twosteps.routes.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.ngtu.twosteps.jpa.entity.route.RouteFilter;
import ru.ngtu.twosteps.jpa.entity.route.Route;
import ru.ngtu.twosteps.jpa.entity.route.history.HistoryRoute;
import ru.ngtu.twosteps.routes.services.UserRouteService;

import java.util.List;

/**
 * @author Egor Bokov
 */
@RestController
@RequestMapping("/api/v1/user/routes")
@RequiredArgsConstructor
@Tag(name = "User routes", description = "User routes endpoints")
public class UserRoutesController {

    private final UserRouteService userRouteService;

    @PostMapping("/history")
    public List<Route> getHistory(@RequestBody RouteFilter filter) {
        return userRouteService.getHistory(filter);
    }

    @PostMapping("/favourite")
    public List<Route> getFavourite(@RequestBody RouteFilter filter) {
        return userRouteService.getFavourite(filter);
    }

    @PostMapping("/like")
    public void likeRoute(@RequestParam Long routeId) {
        userRouteService.likeRoute(routeId);
    }

    @PostMapping("/unlike")
    public void unlikeRoute(@RequestParam Long routeId) {
        userRouteService.unlikeRoute(routeId);
    }

    @PostMapping("/start")
    public HistoryRoute start(@RequestParam Long routeId)  {
        return userRouteService.start(routeId);
    }

    @PostMapping("/leave")
    public HistoryRoute leave(@RequestParam Long historyId) {
        return userRouteService.leave(historyId);
    }

    @PostMapping("/finish")
    public HistoryRoute finish(@RequestParam Long historyId) {
        return userRouteService.finish(historyId);
    }
}

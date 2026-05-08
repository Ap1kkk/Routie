package ru.ngtu.twosteps.routes.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.ngtu.twosteps.jpa.entity.route.Route;
import ru.ngtu.twosteps.faker.RouteFaker;
import ru.ngtu.twosteps.routes.services.RouteService;
import ru.ngtu.twosteps.jpa.entity.route.RouteFilter;

import java.util.List;

/**
 * @author Egor Bokov
 */
@RestController
@RequestMapping("/api/v1/route")
@RequiredArgsConstructor
@Tag(name = "Route", description = "Route endpoints")
public class RouteController {

    private final RouteService routeService;

    @GetMapping("/by-id")
    public Route getById(@RequestParam Long id) {
        return routeService.getById(id);
    }

    @PostMapping("/search")
    public List<Route> getAll(@RequestBody RouteFilter filter, @RequestParam String query) {
        return routeService.search(query, filter);
    }

    @PostMapping("/filter")
    public List<Route> getFiltered(@RequestBody RouteFilter filter) {
        return routeService.getFilteredRoutes(filter);
    }

    @GetMapping("/daily")
    public Route getDaily() {
        return routeService.getDaily();
    }

    @PostMapping("/popular")
    public List<Route> getPopular(@RequestParam int limit) {
        return routeService.getPopular(limit);
    }

    @PostMapping("/popular-filtered")
    public List<Route> getPopularWithFilter(@RequestParam int limit, @RequestBody RouteFilter filter) {
        return routeService.getPopularFiltered(filter, limit);
    }

    @PostMapping("/recommended")
    public List<Route> getRecommended(@RequestParam int limit) {
        return routeService.getRecommended(limit);
    }

    @PostMapping("/recommended-filtered")
    public List<Route> getRecommendedWithFilters(@RequestParam int limit, @RequestBody RouteFilter filter) {
        return routeService.getRecommended(limit, filter);
    }
}

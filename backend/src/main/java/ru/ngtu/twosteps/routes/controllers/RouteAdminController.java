package ru.ngtu.twosteps.routes.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.ngtu.twosteps.jpa.entity.route.Route;
import ru.ngtu.twosteps.routes.dto.RouteDto;
import ru.ngtu.twosteps.routes.services.RouteService;

import java.util.List;

/**
 * @author Egor Bokov
 */
@RestController
@RequestMapping("/api/v1/admin/route")
@RequiredArgsConstructor
@Tag(name = "Route admin", description = "Route admin endpoints")
public class RouteAdminController {

    private final RouteService routeService;

    @GetMapping
    public List<Route> getAllRoutes() {
        return routeService.getAll();
    }

    @PostMapping("/create")
    public Route create(@ModelAttribute RouteDto dto) {
        return routeService.create(dto);
    }
}

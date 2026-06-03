package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.session.request.FinishSessionRequest;
import ru.ngtu.v1.routie.dto.session.request.ReachCheckpointRequest;
import ru.ngtu.v1.routie.dto.session.request.StartSessionRequest;
import ru.ngtu.v1.routie.dto.session.response.RouteSessionResponse;
import ru.ngtu.v1.routie.service.RouteSessionService;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
@Tag(name = "Sessions", description = "Прохождение маршрутов")
public class RouteSessionControllerV1 {

    private final RouteSessionService routeSessionService;

    @PostMapping("/start")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Начало сессии прохождения маршрута")
    public ApiResponse<RouteSessionResponse> startSession(
            @Valid @RequestBody StartSessionRequest request
    ) {
        return ApiResponse.of(routeSessionService.startSession(request));
    }

    @PostMapping("/checkpoint")
    @Operation(summary = "Достижение чекпоинта")
    public ApiResponse<RouteSessionResponse> reachCheckpoint(
            @Valid @RequestBody ReachCheckpointRequest request
    ) {
        return ApiResponse.of(routeSessionService.reachCheckpoint(request));
    }

    @PostMapping("/finish")
    @Operation(summary = "Завершение маршрута (FINISHED или ABORTED)")
    public ApiResponse<RouteSessionResponse> finishSession(
            @Valid @RequestBody FinishSessionRequest request
    ) {
        return ApiResponse.of(routeSessionService.finishSession(request));
    }
}

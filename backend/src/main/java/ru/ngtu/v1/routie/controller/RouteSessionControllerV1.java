package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.ApiResponseVoid;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.session.RouteSessionStatus;
import ru.ngtu.v1.routie.dto.session.request.AbortActiveSessionRequest;
import ru.ngtu.v1.routie.dto.session.request.FinishSessionRequest;
import ru.ngtu.v1.routie.dto.session.request.ReachCheckpointRequest;
import ru.ngtu.v1.routie.dto.session.request.StartSessionRequest;
import ru.ngtu.v1.routie.dto.session.response.RouteSessionResponse;
import ru.ngtu.v1.routie.service.RouteSessionService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
@Validated
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

    @GetMapping("/active")
    @Operation(summary = "Активная сессия текущего пользователя (null, если нет активной)")
    public ApiResponse<RouteSessionResponse> getActiveSession() {
        return ApiResponse.of(routeSessionService.getActiveSession());
    }

    @PostMapping("/abort")
    @Operation(summary = "Прервать активную сессию текущего пользователя (статус ABORTED)")
    public ApiResponseVoid abortActiveSession(
            @Valid @RequestBody(required = false) AbortActiveSessionRequest request
    ) {
        routeSessionService.abortActiveSession(
                request != null ? request : new AbortActiveSessionRequest());
        return ApiResponse.empty();
    }

    @GetMapping("/history")
    @Operation(summary = "История сессий текущего пользователя с фильтрацией по статусу и маршруту")
    public ApiResponse<PageResponse<RouteSessionResponse>> getSessionHistory(
            @RequestParam(required = false) RouteSessionStatus status,
            @RequestParam(required = false) UUID routeId,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size
    ) {
        return ApiResponse.of(routeSessionService.getSessionHistory(status, routeId, page, size));
    }
}

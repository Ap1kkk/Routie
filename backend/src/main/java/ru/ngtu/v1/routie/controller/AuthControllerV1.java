package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.ngtu.v1.routie.dto.auth.*;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.ApiResponseVoid;
import ru.ngtu.v1.routie.service.AuthService;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Сервис идентификации и авторизации")
@SecurityRequirements
public class AuthControllerV1 {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Регистрация нового пользователя")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody UserRegisterRequest request) {
        return ApiResponse.of(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Авторизация пользователя")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.of(authService.login(request));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Обновление access token")
    public ApiResponse<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ApiResponse.of(authService.refreshToken(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Выход из системы")
    @SecurityRequirement(name = "bearerAuth")
    public ApiResponseVoid logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request);
        return ApiResponse.empty();
    }

    @GetMapping("/me")
    @Operation(summary = "Получение информации о текущем пользователе")
    @SecurityRequirement(name = "bearerAuth")
    public ApiResponse<UserMeResponse> getCurrentUser() {
        return ApiResponse.of(authService.getCurrentUser());
    }

    @GetMapping("/roles")
    @Operation(summary = "Получение ролей текущего пользователя")
    @SecurityRequirement(name = "bearerAuth")
    public ApiResponse<RolesResponse> getRoles() {
        return ApiResponse.of(authService.getCurrentUserRoles());
    }
}

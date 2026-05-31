package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.ngtu.v1.routie.dto.auth.AuthResponse;
import ru.ngtu.v1.routie.dto.auth.LoginRequest;
import ru.ngtu.v1.routie.dto.auth.RolesResponse;
import ru.ngtu.v1.routie.dto.auth.UserMeResponse;
import ru.ngtu.v1.routie.dto.auth.UserRegisterRequest;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.ApiResponseVoid;
import ru.ngtu.v1.routie.service.AuthService;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Сервис идентификации и авторизации")
public class AuthControllerV1 {

  private final AuthService authService;

  @PostMapping("/register")
  @Operation(summary = "Регистрация нового пользователя")
  public ApiResponse<AuthResponse> register(
      @Valid @RequestBody UserRegisterRequest request) {
    return ApiResponse.of(authService.register(request));
  }

  @PostMapping("/login")
  @Operation(summary = "Авторизация пользователя")
  public ApiResponse<AuthResponse> login(
      @Valid @RequestBody LoginRequest request) {
    return ApiResponse.of(authService.login(request));
  }

  @PostMapping("/refresh")
  @Operation(summary = "Обновление access token")
  public ApiResponse<AuthResponse> refresh() {
    return ApiResponse.of(authService.refreshToken());
  }

  @PostMapping("/logout")
  @Operation(summary = "Выход из системы")
  public ApiResponseVoid logout() {
    authService.logout();
    return ApiResponse.empty();
  }

  @GetMapping("/me")
  @Operation(summary = "Получение информации о текущем пользователе")
  public ApiResponse<UserMeResponse> getCurrentUser() {
    return ApiResponse.of(authService.getCurrentUser());
  }

  @GetMapping("/roles")
  @Operation(summary = "Получение ролей текущего пользователя")
  public ApiResponse<RolesResponse> getRoles() {
    return ApiResponse.of(authService.getCurrentUserRoles());
  }
}
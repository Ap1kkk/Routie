package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import ru.ngtu.v1.routie.dto.auth.AuthResponse;
import ru.ngtu.v1.routie.dto.auth.LoginRequest;
import ru.ngtu.v1.routie.dto.auth.RolesResponse;
import ru.ngtu.v1.routie.dto.auth.UserMeResponse;
import ru.ngtu.v1.routie.dto.auth.UserRegisterRequest;
import ru.ngtu.v1.routie.service.AuthService;

/**
 * Мок-реализация AuthService для локальной разработки и тестирования
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private static final String MOCK_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mok-token-1234567890";
  private static final UUID MOCK_USER_ID = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");

  @Override
  public AuthResponse register(UserRegisterRequest request) {
    log.info("Мок-регистрация пользователя: {}", request.getEmail());

    return createMockAuthResponse();
  }

  @Override
  public AuthResponse login(LoginRequest request) {
    log.info("Мок-авторизация пользователя: {}", request.getEmail());

    return createMockAuthResponse();
  }

  @Override
  public AuthResponse refreshToken() {
    log.info("Мок-обновление access token");
    return createMockAuthResponse();
  }

  @Override
  public void logout() {
    log.info("Мок-выход из системы");
    // В мок-реализации ничего не делаем
  }

  @Override
  public UserMeResponse getCurrentUser() {
    log.info("Мок-получение текущего пользователя");

    return new UserMeResponse(
        MOCK_USER_ID,
        "user@example.com",
        "Иван",
        "Иванов",
        List.of("USER")
    );
  }

  @Override
  public RolesResponse getCurrentUserRoles() {
    log.info("Мок-получение ролей пользователя");
    return new RolesResponse(List.of("USER", "ADMIN"));
  }

  /**
   * Вспомогательный метод для создания мокового токена
   */
  private AuthResponse createMockAuthResponse() {
    return new AuthResponse(
        MOCK_ACCESS_TOKEN,
        "Bearer",
        900 // 15 минут
    );
  }
}
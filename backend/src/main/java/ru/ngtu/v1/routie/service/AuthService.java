package ru.ngtu.v1.routie.service;

import ru.ngtu.v1.routie.dto.auth.AuthResponse;
import ru.ngtu.v1.routie.dto.auth.LoginRequest;
import ru.ngtu.v1.routie.dto.auth.RolesResponse;
import ru.ngtu.v1.routie.dto.auth.UserMeResponse;
import ru.ngtu.v1.routie.dto.auth.UserRegisterRequest;

/**
 * Сервис идентификации и авторизации пользователей
 */
public interface AuthService {

  /**
   * Регистрация нового пользователя
   */
  AuthResponse register(UserRegisterRequest request);

  /**
   * Авторизация пользователя по email и паролю
   */
  AuthResponse login(LoginRequest request);

  /**
   * Обновление access-токена с помощью refresh-токена
   */
  AuthResponse refreshToken();

  /**
   * Выход из системы (инвалидация refresh-токена)
   */
  void logout();

  /**
   * Получение информации о текущем авторизованном пользователе
   */
  UserMeResponse getCurrentUser();

  /**
   * Получение ролей текущего пользователя
   */
  RolesResponse getCurrentUserRoles();
}
package ru.ngtu.v1.routie.service;

import ru.ngtu.v1.routie.dto.auth.*;

import java.util.List;
import java.util.UUID;

public interface AuthService {

    AuthResponse register(UserRegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(RefreshTokenRequest request);

    UserMeResponse getCurrentUser();

    RolesResponse getCurrentUserRoles();

    // ── Управление сессиями ──────────────────────────────────────────────────

    /** Список всех активных сессий текущего пользователя (одна на устройство). */
    List<UserSessionResponse> getSessions();

    /**
     * Отзыв сессии по deviceId текущего пользователя.
     */
    void revokeSession(String deviceId);

    /** Выход со всех устройств (удаление всех refresh-токенов пользователя). */
    void revokeAllSessions();
}

package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.v1.routie.config.properties.JwtConfigProperties;
import ru.ngtu.v1.routie.dto.auth.*;
import ru.ngtu.v1.routie.exception.BadRequestException;
import ru.ngtu.v1.routie.exception.ConflictException;
import ru.ngtu.v1.routie.exception.EntityNotFoundException;
import ru.ngtu.v1.routie.exception.ForbiddenException;
import ru.ngtu.v1.routie.exception.UnauthorizedException;
import ru.ngtu.v1.routie.model.RefreshToken;
import ru.ngtu.v1.routie.model.User;
import ru.ngtu.v1.routie.model.UserRole;
import ru.ngtu.v1.routie.repository.RefreshTokenRepository;
import ru.ngtu.v1.routie.repository.UserRepository;
import ru.ngtu.v1.routie.security.CustomUserDetails;
import ru.ngtu.v1.routie.security.JwtService;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements ru.ngtu.v1.routie.service.AuthService {

  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final JwtConfigProperties jwtProperties;

  @Override
  @Transactional
  public AuthResponse register(UserRegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new ConflictException("Email уже используется");
    }
    if (userRepository.existsByUsername(request.getUsername())) {
      throw new ConflictException("Username уже занят");
    }

    User user = User.builder()
        .email(request.getEmail())
        .username(request.getUsername())
        .passwordHash(passwordEncoder.encode(request.getPassword()))
        .role(UserRole.USER)
        .build();

    userRepository.save(user);
    log.info("Зарегистрирован новый пользователь: {}", user.getEmail());

    return buildAuthResponse(user, request.getDeviceId(), request.getDeviceName());
  }

  @Override
  @Transactional
  public AuthResponse login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new UnauthorizedException("Неверный email или пароль"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
      throw new UnauthorizedException("Неверный email или пароль");
    }

    log.info("Авторизация пользователя: {} с устройства: {}", user.getEmail(),
        request.getDeviceId());
    return buildAuthResponse(user, request.getDeviceId(), request.getDeviceName());
  }

  @Override
  @Transactional
  public AuthResponse refreshToken(RefreshTokenRequest request) {
    String tokenHash = jwtService.hashToken(request.getRefreshToken());

    RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
        .orElseThrow(() -> new UnauthorizedException("Refresh-токен недействителен"));

    if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
      refreshTokenRepository.delete(refreshToken);
      throw new UnauthorizedException("Refresh-токен истёк");
    }

    // buildAuthResponse выполнит UPDATE существующей строки (та же (user_id, device_id))
    String deviceId   = refreshToken.getDeviceId();
    String deviceName = refreshToken.getDeviceName();
    User   user       = refreshToken.getUser();

    log.info("Обновление токена для пользователя: {}, устройство: {}", user.getEmail(), deviceId);
    return buildAuthResponse(user, deviceId, deviceName);
  }

  @Override
  @Transactional
  public void logout(RefreshTokenRequest request) {
    String tokenHash = jwtService.hashToken(request.getRefreshToken());
    refreshTokenRepository.deleteByTokenHash(tokenHash);
    log.info("Выход из системы, refresh-токен инвалидирован");
  }

  @Override
  public UserMeResponse getCurrentUser() {
    User user = getCurrentAuthenticatedUser();
    return new UserMeResponse(
        user.getId(),
        user.getEmail(),
        user.getUsername(),
        List.of(user.getRole().name())
    );
  }

  @Override
  public RolesResponse getCurrentUserRoles() {
    User user = getCurrentAuthenticatedUser();
    return new RolesResponse(List.of(user.getRole().name()));
  }

  // ── Управление сессиями ──────────────────────────────────────────────────

  @Override
  @Transactional(readOnly = true)
  public List<UserSessionResponse> getSessions() {
    User user = getCurrentAuthenticatedUser();
    return refreshTokenRepository.findAllByUser(user).stream()
        .map(this::toSessionResponse)
        .toList();
  }

  @Override
  @Transactional
  public void revokeSession(String deviceId) {
    User user = getCurrentAuthenticatedUser();

    RefreshToken token = refreshTokenRepository.findByUserAndDeviceId(user, deviceId)
        .orElseThrow(() -> new EntityNotFoundException("Сессия для устройства " + deviceId));

    refreshTokenRepository.delete(token);
    log.info("Сессия устройства '{}' отозвана пользователем {}", deviceId, user.getEmail());
  }

  @Override
  @Transactional
  public void revokeAllSessions() {
    User user = getCurrentAuthenticatedUser();
    refreshTokenRepository.deleteAllByUser(user);
    log.info("Все сессии пользователя {} удалены", user.getEmail());
  }

  // ── Вспомогательные методы ───────────────────────────────────────────────

  /**
   * Создаёт или обновляет refresh-токен для устройства (upsert по deviceId):
   * <ul>
   *   <li>Если сессия с таким deviceId уже есть — обновляем строку через UPDATE (без DELETE+INSERT,
   *       чтобы избежать нарушения уникального ограничения из-за Hibernate write-behind).</li>
   *   <li>Если сессии нет — вставляем новую строку.</li>
   * </ul>
   */
  private AuthResponse buildAuthResponse(User user, String deviceId, String deviceName) {
    String accessToken     = jwtService.generateAccessToken(user);
    String rawRefreshToken = jwtService.generateRefreshToken();
    Instant now            = Instant.now();
    Instant expiresAt      = now.plusSeconds(jwtProperties.getRefreshExpiration());
    String  newHash        = jwtService.hashToken(rawRefreshToken);

    int updated = refreshTokenRepository.updateTokenForDevice(
        user, deviceId, deviceName, newHash, expiresAt, now
    );

    if (updated == 0) {
      // Новое устройство — создаём запись
      RefreshToken refreshToken = RefreshToken.builder()
          .tokenHash(newHash)
          .user(user)
          .deviceId(deviceId)
          .deviceName(deviceName)
          .expiresAt(expiresAt)
          .lastUsedAt(now)
          .build();
      refreshTokenRepository.save(refreshToken);
    }

    return new AuthResponse(accessToken, "Bearer", jwtProperties.getExpiration(), rawRefreshToken);
  }

  private UserSessionResponse toSessionResponse(RefreshToken token) {
    return UserSessionResponse.builder()
        .id(token.getId())
        .deviceId(token.getDeviceId())
        .deviceName(token.getDeviceName())
        .createdAt(token.getCreatedAt())
        .lastUsedAt(token.getLastUsedAt())
        .expiresAt(token.getExpiresAt())
        .build();
  }

  private User getCurrentAuthenticatedUser() {
    try {
      CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
          .getContext()
          .getAuthentication()
          .getPrincipal();

      return userRepository.findById(userDetails.getId())
          .orElseThrow(() -> new EntityNotFoundException("Пользователь", userDetails.getId()));
    } catch (ClassCastException e) {
      throw new UnauthorizedException("Необходима авторизация");
    }
  }
}

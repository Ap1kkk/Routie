package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import ru.ngtu.v1.routie.exception.BadRequestException;
import ru.ngtu.v1.routie.exception.ConflictException;
import ru.ngtu.v1.routie.exception.EntityNotFoundException;
import ru.ngtu.v1.routie.exception.UnauthorizedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.v1.routie.config.properties.JwtConfigProperties;
import ru.ngtu.v1.routie.dto.auth.*;
import ru.ngtu.v1.routie.model.RefreshToken;
import ru.ngtu.v1.routie.model.User;
import ru.ngtu.v1.routie.model.UserRole;
import ru.ngtu.v1.routie.repository.RefreshTokenRepository;
import ru.ngtu.v1.routie.repository.UserRepository;
import ru.ngtu.v1.routie.security.CustomUserDetails;
import ru.ngtu.v1.routie.security.JwtService;

import java.time.Instant;
import java.util.List;

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

        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Неверный email или пароль"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Неверный email или пароль");
        }

        log.info("Авторизация пользователя: {}", user.getEmail());
        return buildAuthResponse(user);
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

        refreshTokenRepository.delete(refreshToken);

        User user = refreshToken.getUser();
        log.info("Обновление токена для пользователя: {}", user.getEmail());
        return buildAuthResponse(user);
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

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String rawRefreshToken = jwtService.generateRefreshToken();

        RefreshToken refreshToken = RefreshToken.builder()
                .tokenHash(jwtService.hashToken(rawRefreshToken))
                .user(user)
                .expiresAt(Instant.now().plusSeconds(jwtProperties.getRefreshExpiration()))
                .build();

        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(accessToken, "Bearer", jwtProperties.getExpiration(), rawRefreshToken);
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

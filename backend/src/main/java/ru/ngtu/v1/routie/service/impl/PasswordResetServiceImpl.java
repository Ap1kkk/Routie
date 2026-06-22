package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.v1.routie.dto.auth.PasswordChangeDto;
import ru.ngtu.v1.routie.dto.auth.PasswordResetConfirmDto;
import ru.ngtu.v1.routie.dto.auth.PasswordResetRequestDto;
import ru.ngtu.v1.routie.exception.BadRequestException;
import ru.ngtu.v1.routie.exception.EntityNotFoundException;
import ru.ngtu.v1.routie.exception.UnauthorizedException;
import ru.ngtu.v1.routie.model.PasswordResetCode;
import ru.ngtu.v1.routie.model.User;
import ru.ngtu.v1.routie.repository.PasswordResetCodeRepository;
import ru.ngtu.v1.routie.repository.RefreshTokenRepository;
import ru.ngtu.v1.routie.repository.UserRepository;
import ru.ngtu.v1.routie.security.CustomUserDetails;
import ru.ngtu.v1.routie.security.JwtService;
import ru.ngtu.v1.routie.service.EmailService;
import ru.ngtu.v1.routie.service.PasswordResetService;

import java.security.SecureRandom;
import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository              userRepository;
    private final PasswordResetCodeRepository resetCodeRepository;
    private final RefreshTokenRepository      refreshTokenRepository;
    private final PasswordEncoder             passwordEncoder;
    private final JwtService                  jwtService;
    private final EmailService                emailService;

    @Value("${routie.password-reset.code-ttl-seconds:600}")
    private int codeTtlSeconds;

    // ── Сброс пароля (неавторизованный) ─────────────────────────────────────

    @Override
    @Transactional
    public void requestReset(PasswordResetRequestDto request) {
        // Ищем пользователя по email; если не найден — возвращаем успех (не раскрываем наличие аккаунта)
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            // Удаляем предыдущие коды этого пользователя
            resetCodeRepository.deleteAllByUser(user);

            String rawCode = generateOtpCode();

            PasswordResetCode code = PasswordResetCode.builder()
                    .user(user)
                    .codeHash(jwtService.hashToken(rawCode))
                    .expiresAt(Instant.now().plusSeconds(codeTtlSeconds))
                    .build();

            resetCodeRepository.save(code);

            emailService.sendPasswordResetCode(user.getEmail(), rawCode);
            log.info("OTP-код сброса пароля отправлен пользователю: {}", user.getEmail());
        });
    }

    @Override
    @Transactional
    public void confirmReset(PasswordResetConfirmDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Неверный код или email"));

        String codeHash = jwtService.hashToken(request.getCode());

        PasswordResetCode code = resetCodeRepository
                .findActiveCode(user, codeHash, Instant.now())
                .orElseThrow(() -> new BadRequestException("Неверный или истёкший код подтверждения"));

        // Помечаем код как использованный
        code.setUsedAt(Instant.now());
        resetCodeRepository.save(code);

        // Обновляем пароль
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Инвалидируем все сессии — пользователь должен заново войти на всех устройствах
        refreshTokenRepository.deleteAllByUser(user);

        log.info("Пароль успешно сброшен для пользователя: {}", user.getEmail());
    }

    // ── Смена пароля (авторизованный) ───────────────────────────────────────

    @Override
    @Transactional
    public void changePassword(PasswordChangeDto request) {
        User user = getCurrentAuthenticatedUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Неверный текущий пароль");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Пароль изменён пользователем: {}", user.getEmail());
    }

    // ── Вспомогательные методы ───────────────────────────────────────────────

    /** Генерирует криптографически случайный 6-значный числовой OTP. */
    private String generateOtpCode() {
        return String.format("%06d", RANDOM.nextInt(1_000_000));
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

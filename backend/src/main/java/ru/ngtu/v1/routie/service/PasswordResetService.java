package ru.ngtu.v1.routie.service;

import ru.ngtu.v1.routie.dto.auth.PasswordChangeDto;
import ru.ngtu.v1.routie.dto.auth.PasswordResetConfirmDto;
import ru.ngtu.v1.routie.dto.auth.PasswordResetRequestDto;

public interface PasswordResetService {

    /**
     * Генерирует 6-значный OTP-код и отправляет его на email.
     * Если пользователь с таким email не найден — ответ такой же (не раскрываем наличие аккаунта).
     */
    void requestReset(PasswordResetRequestDto request);

    /**
     * Проверяет OTP-код, устанавливает новый пароль,
     * инвалидирует все сессии пользователя.
     */
    void confirmReset(PasswordResetConfirmDto request);

    /**
     * Смена пароля для авторизованного пользователя.
     * Требует подтверждения текущего пароля. Сессии не затрагивает.
     */
    void changePassword(PasswordChangeDto request);
}

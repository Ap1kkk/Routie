package ru.ngtu.v1.routie.service;

public interface EmailService {

    /**
     * Отправляет письмо с OTP-кодом для сброса пароля.
     *
     * @param to   адрес получателя
     * @param code шестизначный OTP-код (plain text, до хэширования)
     */
    void sendPasswordResetCode(String to, String code);
}

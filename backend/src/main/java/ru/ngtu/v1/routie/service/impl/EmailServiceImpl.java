package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import ru.ngtu.v1.routie.service.EmailService;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from:noreply@routie.local}")
    private String from;

    @Override
    public void sendPasswordResetCode(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject("Сброс пароля — Routie");
        message.setText("""
                Вы запросили сброс пароля в приложении Routie.

                Ваш код подтверждения: %s

                Код действителен 10 минут.
                Если вы не запрашивали сброс пароля — проигнорируйте это письмо.
                """.formatted(code));

        mailSender.send(message);
        log.info("Письмо со сбросом пароля отправлено на {}", to);
    }
}

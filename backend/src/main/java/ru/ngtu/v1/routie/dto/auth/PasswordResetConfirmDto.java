package ru.ngtu.v1.routie.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Подтверждение сброса пароля: email + OTP-код + новый пароль")
public class PasswordResetConfirmDto {

    @NotBlank(message = "Email обязателен")
    @Email(message = "Некорректный формат email")
    private String email;

    @NotBlank(message = "Код подтверждения обязателен")
    @Pattern(regexp = "\\d{6}", message = "Код подтверждения должен содержать ровно 6 цифр")
    private String code;

    @NotBlank(message = "Новый пароль обязателен")
    @Size(min = 8, message = "Пароль должен содержать минимум 8 символов")
    private String newPassword;
}

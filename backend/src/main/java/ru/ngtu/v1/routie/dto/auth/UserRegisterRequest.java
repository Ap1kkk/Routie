package ru.ngtu.v1.routie.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на регистрацию пользователя")
public class UserRegisterRequest {

  @NotBlank(message = "Email обязателен")
  @Email(message = "Некорректный формат email")
  private String email;

  @NotBlank(message = "Username обязателен")
  @Size(min = 3, max = 30, message = "Username должен содержать от 3 до 30 символов")
  @Pattern(regexp = "^[a-zA-Z0-9_.-]+$", message = "Username может содержать только латиницу, цифры, '_', '-', '.'")
  private String username;

  @NotBlank(message = "Пароль обязателен")
  @Size(min = 8, message = "Пароль должен содержать минимум 8 символов")
  private String password;

  /** Стабильный ID устройства, генерируется клиентом при первом запуске и хранится локально. */
  @NotBlank(message = "deviceId обязателен")
  private String deviceId;

  /** Читаемое имя устройства (необязательно). */
  private String deviceName;
}

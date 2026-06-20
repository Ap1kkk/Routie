package ru.ngtu.v1.routie.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на авторизацию")
public class LoginRequest {

  @NotBlank(message = "Email обязателен")
  private String email;

  @NotBlank(message = "Пароль обязателен")
  private String password;

  /** Стабильный ID устройства, генерируется клиентом при первом запуске и хранится локально. */
  @NotBlank(message = "deviceId обязателен")
  private String deviceId;

  /** Читаемое имя устройства (необязательно). */
  private String deviceName;
}
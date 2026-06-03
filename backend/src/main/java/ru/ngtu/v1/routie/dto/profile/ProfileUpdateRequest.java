package ru.ngtu.v1.routie.dto.profile;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на обновление профиля пользователя")
public class ProfileUpdateRequest {

  private String name;
  private LocalDate dateOfBirth;
  private Gender gender;
  private String city;
  private String preferredTransport;
}
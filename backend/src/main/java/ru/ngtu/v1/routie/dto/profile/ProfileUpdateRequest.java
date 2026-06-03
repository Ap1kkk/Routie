package ru.ngtu.v1.routie.dto.profile;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
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
    private String favoriteSportType;
    private List<UUID> preferredTags;
}

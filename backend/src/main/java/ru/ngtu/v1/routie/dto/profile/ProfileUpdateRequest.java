package ru.ngtu.v1.routie.dto.profile;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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

    @Size(min = 1, max = 100)
    private String name;

    @Email
    @Size(max = 255)
    private String email;

    @Size(min = 3, max = 30)
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "username может содержать только латинские буквы, цифры и _")
    private String username;

    private LocalDate dateOfBirth;

    private Gender gender;

    @Min(50)
    @Max(300)
    private Integer height;

    @Min(20)
    @Max(500)
    private Integer weight;

    private List<UUID> preferredTags;
}

package ru.ngtu.twosteps.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.twosteps.jpa.entity.user.UserRole;

/**
 * @author Egor Bokov
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCredentialsDto {
    private String username;
    private String email;
    private String password;
    private UserRole role;
}


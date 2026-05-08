package ru.ngtu.twosteps.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.twosteps.jpa.entity.Category;
import ru.ngtu.twosteps.jpa.entity.Region;
import ru.ngtu.twosteps.jpa.entity.user.UserActivity;
import ru.ngtu.twosteps.jpa.entity.user.UserAvatar;
import ru.ngtu.twosteps.jpa.entity.user.User;
import ru.ngtu.twosteps.jpa.entity.user.UserGender;
import ru.ngtu.twosteps.jpa.entity.user.UserRole;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;

/**
 * DTO for {@link User}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProjectionDto {
    private Long id;
    private String username;
    private String email;
    private UserGender gender;
    private UserActivity activity;
    private Region region;
    private UserAvatar avatar;
    private LocalDate birthday;
    private UserRole role;
    private ZonedDateTime createdAt;
    private List<Category> preferences;
}
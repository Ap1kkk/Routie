package ru.ngtu.twosteps.jpa.entity.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

/**
 * @author Egor Bokov
 */
@Getter
@RequiredArgsConstructor
public enum UserRole {
    USER(Set.of(
            UserPermission.USER_PERMISSION
    ), 0),
    ADMIN(Set.of(
            UserPermission.USER_PERMISSION,
            UserPermission.ADMIN_PERMISSION
    ), 2);

    private final Set<UserPermission> userPermissions;
    private final int level;

    public static UserRole fromPermissions(Set<UserPermission> permissions) {
        List<UserRole> suitableRoles = Arrays.stream(UserRole.values())
                .filter(
                        role -> role.getUserPermissions().equals(permissions)
                )
                .toList();
        if(suitableRoles.isEmpty())
            throw new IllegalArgumentException("No suitable role found");

        if(suitableRoles.size() > 1)
            throw new IllegalArgumentException("More than one suitable role found");

        return suitableRoles.get(0);
    }
}
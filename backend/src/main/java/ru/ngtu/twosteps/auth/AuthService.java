package ru.ngtu.twosteps.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import ru.ngtu.twosteps.auth.dto.AuthenticatedDto;
import ru.ngtu.twosteps.auth.dto.AuthenticationCredentialsDto;
import ru.ngtu.twosteps.common.exceptions.classes.data.EntityNotFoundException;
import ru.ngtu.twosteps.common.security.jwt.JwtAuthenticationProvider;
import ru.ngtu.twosteps.jpa.entity.user.User;
import ru.ngtu.twosteps.jpa.entity.user.UserPermission;
import ru.ngtu.twosteps.jpa.entity.user.UserRole;
import ru.ngtu.twosteps.jpa.repository.user.UserRepository;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/**
 * @author Egor Bokov
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtAuthenticationProvider jwtProvider;
    private final UserRepository userRepository;

    public boolean validate(String token) {
        try {
            String username = jwtProvider.getUsername(token);

            if(StringUtils.hasText(username) && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtProvider.validateToken(token)) {
                    Authentication authentication = jwtProvider.getAuthentication(token);
                    if (authentication != null) {
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        return true;
                    }
                }
            }

            return false;
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
            return false;
        }
    }

    @Transactional
    public AuthenticatedDto authenticate(AuthenticationCredentialsDto userDto) throws AuthenticationException {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDto.getEmail(), userDto.getPassword()));

        User user = userRepository.findByEmail(userDto.getEmail()).get();
        if (user == null) {
            throw new UsernameNotFoundException("User doesn't exists");
        }

        String token = jwtProvider.createToken(userDto.getEmail(), user.getRole().name());

        log.info("Authenticated as {}", userDto.getEmail());

        return AuthenticatedDto
                .builder()
                .token(token)
                .user(user)
                .build();
    }

    /**
     * Extracts current user authentication
     * @return current user authentication
     * @author Egor Bokov
     */
    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    /**
     * Extracts current user email
     * @return current user email
     * @author Egor Bokov
     */
    public String getCurrentUserEmail() {
        Authentication authentication = getAuthentication();
        return authentication.getName();
    }

    public User getCurrentUser() {
        Authentication authentication = getAuthentication();
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException(User.class, "by email [%s]".formatted(authentication.getName())));
    }

    /**
     * Extracts current user permissions
     * @return set of current user permissions
     * @author Egor Bokov
     */
    public Set<UserPermission> getUserPermissions() {
        Set<UserPermission> permissions = new HashSet<>();
        Authentication authentication = getAuthentication();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        for (GrantedAuthority authority : authorities) {
            try {
                permissions.add(UserPermission.valueOf(authority.getAuthority()));
            } catch (IllegalArgumentException ignored) {
            }
        }

        return permissions;
    }

    public UserRole getUserRole() {
        return UserRole.fromPermissions(getUserPermissions());
    }

    public String getUserRoleAsString() {
        UserRole userRole = getUserRole();
        if(userRole == null)
            return null;

        return userRole.toString();
    }

    public Set<UserPermission> getRolePermissions(String role) {
        return getRolePermissions(UserRole.valueOf(role));
    }

    public Set<UserPermission> getRolePermissions(UserRole role) {
        return role.getUserPermissions();
    }
}

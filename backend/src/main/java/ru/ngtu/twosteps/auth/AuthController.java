package ru.ngtu.twosteps.auth;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.ngtu.twosteps.auth.dto.AuthenticatedDto;
import ru.ngtu.twosteps.auth.dto.AuthenticationCredentialsDto;
import ru.ngtu.twosteps.user.dto.CreateCredentialsDto;
import ru.ngtu.twosteps.user.UserService;

/**
 * @author Egor Bokov
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Auth endpoints")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public AuthenticatedDto login(@RequestBody AuthenticationCredentialsDto dto) {
        return authService.authenticate(dto);
    }

    @GetMapping("/validate")
    public boolean validate(@RequestParam String token) {
        return authService.validate(token);
    }

    @PostMapping("/register")
    public AuthenticatedDto register(@RequestBody CreateCredentialsDto dto) {
        userService.create(dto);
        return authService.authenticate(AuthenticationCredentialsDto
                .builder()
                .email(dto.getEmail())
                .password(dto.getPassword())
                .build()
        );
    }
}

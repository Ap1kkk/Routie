package ru.ngtu.v1.routie.service.stub;

import lombok.extern.slf4j.Slf4j;
import net.datafaker.Faker;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import ru.ngtu.v1.routie.dto.auth.*;
import ru.ngtu.v1.routie.service.AuthService;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@Profile("stub-auth")
@Primary
public class AuthServiceStub implements AuthService {

    private static final String FAKE_ACCESS_TOKEN =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
            ".eyJzdWIiOiJzdHViLXVzZXIiLCJyb2xlcyI6WyJVU0VSIl19" +
            ".stub_signature";
    private static final String FAKE_REFRESH_TOKEN = "stub-refresh-token-1234567890";

    private final Faker faker = FakeDataFactory.getFaker();

    @Override
    public AuthResponse register(UserRegisterRequest request) {
        log.debug("[STUB] register: {}", request.getEmail());
        return new AuthResponse(FAKE_ACCESS_TOKEN, "Bearer", 900, FAKE_REFRESH_TOKEN);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.debug("[STUB] login: {}", request.getEmail());
        return new AuthResponse(FAKE_ACCESS_TOKEN, "Bearer", 900, FAKE_REFRESH_TOKEN);
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        log.debug("[STUB] refreshToken");
        return new AuthResponse(FAKE_ACCESS_TOKEN, "Bearer", 900, FAKE_REFRESH_TOKEN);
    }

    @Override
    public void logout(RefreshTokenRequest request) {
        log.debug("[STUB] logout");
    }

    @Override
    public UserMeResponse getCurrentUser() {
        log.debug("[STUB] getCurrentUser");
        return new UserMeResponse(
                UUID.randomUUID(),
                faker.internet().emailAddress(),
                faker.name().fullName(),
                faker.internet().username(),
                List.of("USER")
        );
    }

    @Override
    public RolesResponse getCurrentUserRoles() {
        log.debug("[STUB] getCurrentUserRoles");
        return new RolesResponse(List.of("USER"));
    }
}

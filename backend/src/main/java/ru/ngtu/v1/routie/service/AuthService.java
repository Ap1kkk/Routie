package ru.ngtu.v1.routie.service;

import ru.ngtu.v1.routie.dto.auth.AuthResponse;
import ru.ngtu.v1.routie.dto.auth.LoginRequest;
import ru.ngtu.v1.routie.dto.auth.RefreshTokenRequest;
import ru.ngtu.v1.routie.dto.auth.RolesResponse;
import ru.ngtu.v1.routie.dto.auth.UserMeResponse;
import ru.ngtu.v1.routie.dto.auth.UserRegisterRequest;

public interface AuthService {

    AuthResponse register(UserRegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(RefreshTokenRequest request);

    UserMeResponse getCurrentUser();

    RolesResponse getCurrentUserRoles();
}

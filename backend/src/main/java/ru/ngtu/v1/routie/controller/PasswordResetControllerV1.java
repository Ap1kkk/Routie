package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.ngtu.v1.routie.dto.auth.PasswordChangeDto;
import ru.ngtu.v1.routie.dto.auth.PasswordResetConfirmDto;
import ru.ngtu.v1.routie.dto.auth.PasswordResetRequestDto;
import ru.ngtu.v1.routie.dto.common.ApiResponseVoid;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.service.PasswordResetService;

@RestController
@RequestMapping("/api/v1/auth/password")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Сервис идентификации и авторизации")
public class PasswordResetControllerV1 {

    private final PasswordResetService passwordResetService;

    @PostMapping("/reset/request")
    @SecurityRequirements   // публичный эндпоинт
    @Operation(summary = "Запрос OTP-кода для сброса пароля (отправляется на email)")
    public ApiResponseVoid requestReset(@Valid @RequestBody PasswordResetRequestDto request) {
        passwordResetService.requestReset(request);
        return ApiResponse.empty();
    }

    @PostMapping("/reset/confirm")
    @SecurityRequirements   // публичный эндпоинт
    @Operation(summary = "Подтверждение сброса пароля (OTP-код + новый пароль)")
    public ApiResponseVoid confirmReset(@Valid @RequestBody PasswordResetConfirmDto request) {
        passwordResetService.confirmReset(request);
        return ApiResponse.empty();
    }

    @PatchMapping("/change")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Смена пароля для авторизованного пользователя")
    public ApiResponseVoid changePassword(@Valid @RequestBody PasswordChangeDto request) {
        passwordResetService.changePassword(request);
        return ApiResponse.empty();
    }
}

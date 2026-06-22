package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.ApiResponseVoid;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.notification.NotificationResponse;
import ru.ngtu.v1.routie.service.NotificationService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Validated
@Tag(name = "Notifications", description = "Уведомления (достижения, начисление XP). Доставляются также через WebSocket /ws")
@SecurityRequirement(name = "bearerAuth")
public class NotificationControllerV1 {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Список уведомлений текущего пользователя (новые сверху)")
    public ApiResponse<PageResponse<NotificationResponse>> getNotifications(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size
    ) {
        return ApiResponse.of(notificationService.getNotifications(page, size));
    }

    @GetMapping("/unread")
    @Operation(summary = "Список непрочитанных уведомлений текущего пользователя (новые сверху)")
    public ApiResponse<PageResponse<NotificationResponse>> getUnreadNotifications(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size
    ) {
        return ApiResponse.of(notificationService.getUnreadNotifications(page, size));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Кол-во непрочитанных уведомлений")
    public ApiResponse<Long> getUnreadCount() {
        return ApiResponse.of(notificationService.getUnreadCount());
    }

    @PatchMapping("/{notificationId}/read")
    @Operation(summary = "Отметить уведомление как прочитанное")
    public ApiResponseVoid markAsRead(@PathVariable UUID notificationId) {
        notificationService.markAsRead(notificationId);
        return ApiResponse.empty();
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Отметить все уведомления как прочитанные")
    public ApiResponseVoid markAllAsRead() {
        notificationService.markAllAsRead();
        return ApiResponse.empty();
    }
}

package ru.ngtu.v1.routie.service;

import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.notification.NotificationResponse;
import ru.ngtu.v1.routie.model.NotificationType;

import java.util.UUID;

public interface NotificationService {

    /**
     * Создаёт уведомление, сохраняет его и немедленно отправляет пользователю
     * через WebSocket (если у него есть открытая сессия — STOMP-топик {@code /user/queue/notifications}).
     */
    void notify(UUID userId, NotificationType type, String title, String body, String payload);

    /** Список уведомлений текущего пользователя, новые сверху. */
    PageResponse<NotificationResponse> getNotifications(int page, int size);

    /** Только непрочитанные уведомления текущего пользователя, новые сверху. */
    PageResponse<NotificationResponse> getUnreadNotifications(int page, int size);

    long getUnreadCount();

    void markAsRead(UUID notificationId);

    void markAllAsRead();
}

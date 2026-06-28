package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.notification.NotificationResponse;
import ru.ngtu.v1.routie.exception.EntityNotFoundException;
import ru.ngtu.v1.routie.exception.ForbiddenException;
import ru.ngtu.v1.routie.model.Notification;
import ru.ngtu.v1.routie.model.NotificationType;
import ru.ngtu.v1.routie.repository.NotificationRepository;
import ru.ngtu.v1.routie.security.CustomUserDetails;
import ru.ngtu.v1.routie.service.NotificationService;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    /** Должен совпадать с {@code setUserDestinationPrefix} в WebSocketConfig. */
    private static final String USER_QUEUE_DESTINATION = "/queue/notifications";

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public void notify(UUID userId, NotificationType type, String title, String body, String payload) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .body(body)
                .payload(payload)
                .build();

        notification = notificationRepository.save(notification);
        log.info("Уведомление создано: userId={}, type={}, title={}", userId, type, title);

        NotificationResponse response = toResponse(notification);
        try {
            // Доставляется только если у пользователя есть открытая WebSocket-сессия; иначе просто остаётся в БД
            messagingTemplate.convertAndSendToUser(userId.toString(), USER_QUEUE_DESTINATION, response);
        } catch (Exception e) {
            log.warn("Не удалось отправить push-уведомление userId={}: {}", userId, e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> getNotifications(int page, int size) {
        UUID userId = getCurrentUserId();
        PageRequest pageable = PageRequest.of(page, size);

        Page<Notification> notificationsPage =
                notificationRepository.findAllByUserIdOrderByCreatedAtDesc(userId, pageable);

        return new PageResponse<>(
                notificationsPage.getContent().stream().map(this::toResponse).toList(),
                notificationsPage.getTotalElements(),
                notificationsPage.getTotalPages(),
                page
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> getUnreadNotifications(int page, int size) {
        UUID userId = getCurrentUserId();
        PageRequest pageable = PageRequest.of(page, size);

        Page<Notification> notificationsPage =
                notificationRepository.findAllByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId, pageable);

        return new PageResponse<>(
                notificationsPage.getContent().stream().map(this::toResponse).toList(),
                notificationsPage.getTotalElements(),
                notificationsPage.getTotalPages(),
                page
        );
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount() {
        return notificationRepository.countByUserIdAndIsReadFalse(getCurrentUserId());
    }

    @Override
    @Transactional
    public void markAsRead(UUID notificationId) {
        UUID userId = getCurrentUserId();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("Уведомление", notificationId));

        if (!notification.getUserId().equals(userId)) {
            throw new ForbiddenException("Нет доступа к этому уведомлению");
        }

        if (!Boolean.TRUE.equals(notification.getIsRead())) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        notificationRepository.markAllAsRead(getCurrentUserId());
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType())
                .title(n.getTitle())
                .body(n.getBody())
                .payload(n.getPayload())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build();
    }

    private UUID getCurrentUserId() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        return userDetails.getId();
    }
}

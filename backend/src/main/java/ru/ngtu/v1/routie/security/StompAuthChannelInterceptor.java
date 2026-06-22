package ru.ngtu.v1.routie.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.UUID;

/**
 * Аутентификация STOMP-соединения по JWT.
 * Клиент передаёт токен в заголовке CONNECT-фрейма: {@code Authorization: Bearer <accessToken>}.
 * После успешной проверки {@link Principal#getName()} становится userId — это позволяет
 * адресовать сообщения через {@code SimpMessagingTemplate.convertAndSendToUser(userId, ...)}.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StompAuthChannelInterceptor implements ChannelInterceptor {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;

    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
                String token = authHeader.substring(BEARER_PREFIX.length());

                if (jwtService.isTokenValid(token)) {
                    UUID userId = jwtService.extractUserId(token);
                    Principal principal = new UsernamePasswordAuthenticationToken(userId.toString(), null, null);
                    accessor.setUser(principal);
                    log.debug("WebSocket CONNECT аутентифицирован: userId={}", userId);
                } else {
                    log.warn("WebSocket CONNECT отклонён: невалидный токен");
                }
            } else {
                log.warn("WebSocket CONNECT без заголовка Authorization");
            }
        }

        return message;
    }
}

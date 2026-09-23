package ru.ngtu.v1.routie.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@Schema(description = "Активная сессия пользователя (устройство)")
public class UserSessionResponse {

    @Schema(description = "ID записи сессии (используется для отзыва)")
    private UUID id;

    @Schema(description = "Идентификатор устройства, переданный клиентом при логине")
    private String deviceId;

    @Schema(description = "Читаемое имя устройства")
    private String deviceName;

    @Schema(description = "Время создания сессии (первый логин с этого устройства)")
    private Instant createdAt;

    @Schema(description = "Время последнего использования токена (последний refresh)")
    private Instant lastUsedAt;

    @Schema(description = "Время истечения refresh-токена")
    private Instant expiresAt;
}

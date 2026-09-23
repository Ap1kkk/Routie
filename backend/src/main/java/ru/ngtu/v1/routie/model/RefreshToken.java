package ru.ngtu.v1.routie.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "auth_sessions",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_auth_sessions_user_device",
        columnNames = {"user_id", "device_id"}
    )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String tokenHash;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Стабильный идентификатор устройства, генерируется клиентом при первом запуске. */
    @Column(name = "device_id", nullable = false, length = 255)
    private String deviceId;

    /** Читаемое имя устройства (например, «iPhone 14», «Chrome / Windows»). Необязательно. */
    @Column(name = "device_name", length = 255)
    private String deviceName;

    @Column(nullable = false)
    private Instant expiresAt;

    /** Обновляется при каждом успешном использовании токена (refresh). */
    @Column(nullable = false)
    private Instant lastUsedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}

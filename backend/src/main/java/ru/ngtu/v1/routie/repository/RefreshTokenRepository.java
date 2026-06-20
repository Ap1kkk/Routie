package ru.ngtu.v1.routie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.model.RefreshToken;
import ru.ngtu.v1.routie.model.User;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    /** Все активные сессии пользователя (для отображения списка устройств). */
    List<RefreshToken> findAllByUser(User user);

    /** Поиск сессии по пользователю и deviceId (для upsert при повторном логине). */
    Optional<RefreshToken> findByUserAndDeviceId(User user, String deviceId);

    /**
     * Обновляет существующий токен для устройства (upsert-UPDATE).
     *
     * @return количество обновлённых строк (0 — устройство новое, нужен INSERT)
     */
    @Modifying
    @Query("""
        UPDATE RefreshToken rt
        SET rt.tokenHash  = :tokenHash,
            rt.deviceName = :deviceName,
            rt.expiresAt  = :expiresAt,
            rt.lastUsedAt = :lastUsedAt
        WHERE rt.user = :user AND rt.deviceId = :deviceId
        """)
    int updateTokenForDevice(
            @Param("user")       User user,
            @Param("deviceId")   String deviceId,
            @Param("deviceName") String deviceName,
            @Param("tokenHash")  String tokenHash,
            @Param("expiresAt")  Instant expiresAt,
            @Param("lastUsedAt") Instant lastUsedAt
    );

    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.user = :user")
    void deleteAllByUser(User user);

    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.tokenHash = :tokenHash")
    void deleteByTokenHash(String tokenHash);

}

package ru.ngtu.v1.routie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.model.PasswordResetCode;
import ru.ngtu.v1.routie.model.User;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface PasswordResetCodeRepository extends JpaRepository<PasswordResetCode, UUID> {

    /**
     * Ищет активный (не истёкший, не использованный) код по пользователю и хэшу.
     */
    @Query("""
        SELECT c FROM PasswordResetCode c
        WHERE c.user = :user
          AND c.codeHash = :codeHash
          AND c.expiresAt > :now
          AND c.usedAt IS NULL
        """)
    Optional<PasswordResetCode> findActiveCode(
            @Param("user")     User user,
            @Param("codeHash") String codeHash,
            @Param("now")      Instant now
    );

    /** Удаляет все предыдущие коды пользователя перед выдачей нового. */
    @Modifying
    @Query("DELETE FROM PasswordResetCode c WHERE c.user = :user")
    void deleteAllByUser(@Param("user") User user);
}

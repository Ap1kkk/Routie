package ru.ngtu.v1.routie.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.model.XpTransaction;
import ru.ngtu.v1.routie.repository.projection.UserXpSum;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface XpTransactionRepository extends JpaRepository<XpTransaction, UUID> {

    Page<XpTransaction> findAllByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM XpTransaction t
        WHERE t.userId = :userId AND t.createdAt >= :since
        """)
    long sumAmountByUserIdSince(@Param("userId") UUID userId, @Param("since") Instant since);

    /** Сумма XP за период для конкретного набора пользователей (для лидерборда среди друзей). */
    @Query("""
        SELECT t.userId AS userId, SUM(t.amount) AS total
        FROM XpTransaction t
        WHERE t.userId IN :userIds AND t.createdAt >= :since
        GROUP BY t.userId
        """)
    List<UserXpSum> sumAmountByUserIdsSince(
            @Param("userIds") Collection<UUID> userIds, @Param("since") Instant since);

    /** Топ пользователей по сумме XP за период (для глобального лидерборда). */
    @Query("""
        SELECT t.userId AS userId, SUM(t.amount) AS total
        FROM XpTransaction t
        WHERE t.createdAt >= :since
        GROUP BY t.userId
        ORDER BY SUM(t.amount) DESC
        """)
    List<UserXpSum> findTopByPeriodSince(@Param("since") Instant since, Pageable pageable);

    /** Суммарный XP, выданный всем пользователям, в диапазоне [since, until] (для общей статистики). */
    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM XpTransaction t
        WHERE t.createdAt BETWEEN :since AND :until
        """)
    long sumAmountBetween(@Param("since") Instant since, @Param("until") Instant until);
}

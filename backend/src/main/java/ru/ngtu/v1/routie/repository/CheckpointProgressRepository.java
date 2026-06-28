package ru.ngtu.v1.routie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.model.CheckpointProgress;
import ru.ngtu.v1.routie.model.RouteSession;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface CheckpointProgressRepository extends JpaRepository<CheckpointProgress, UUID> {

    Optional<CheckpointProgress> findBySessionAndCheckpointId(RouteSession session, UUID checkpointId);

    /** Общее число пройденных точек маршрута пользователем за всё время (для статистики профиля, ALL_TIME). */
    @Query("SELECT COUNT(cp) FROM CheckpointProgress cp WHERE cp.session.userId = :userId")
    long countByUserId(@Param("userId") UUID userId);

    /** Число пройденных точек маршрута пользователем за период (сессия начата в диапазоне [since, until)). */
    @Query("""
        SELECT COUNT(cp) FROM CheckpointProgress cp
        WHERE cp.session.userId = :userId
          AND cp.session.startedAt BETWEEN :since AND :until
        """)
    long countByUserIdAndSessionStartedAtBetween(
            @Param("userId") UUID userId,
            @Param("since") Instant since,
            @Param("until") Instant until
    );
}

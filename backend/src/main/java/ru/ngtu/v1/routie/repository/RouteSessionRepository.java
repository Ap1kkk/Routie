package ru.ngtu.v1.routie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.dto.session.RouteSessionStatus;
import ru.ngtu.v1.routie.model.RouteSession;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface RouteSessionRepository extends JpaRepository<RouteSession, UUID>, JpaSpecificationExecutor<RouteSession> {

    Optional<RouteSession> findByUserIdAndStatus(UUID userId, RouteSessionStatus status);

    boolean existsByUserIdAndStatus(UUID userId, RouteSessionStatus status);

    @Query("SELECT DISTINCT s.routeId FROM RouteSession s WHERE s.userId = :userId AND s.status = 'FINISHED'")
    List<UUID> findFinishedRouteIdsByUserId(@Param("userId") UUID userId);

    /**
     * Возвращает все FINISHED-сессии пользователя, исключая указанную.
     * Используется для подсчёта новых уникальных ландмарков при завершении сессии.
     */
    @Query("SELECT s FROM RouteSession s WHERE s.userId = :userId AND s.status = 'FINISHED' AND s.id != :excludeSessionId")
    List<RouteSession> findFinishedByUserIdExcludingSession(
            @Param("userId") UUID userId,
            @Param("excludeSessionId") UUID excludeSessionId
    );
}

package ru.ngtu.twosteps.jpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.Duration;
import java.time.ZonedDateTime;
import ru.ngtu.twosteps.jpa.entity.route.history.HistoryRoute;
import ru.ngtu.twosteps.jpa.entity.route.history.HistoryRouteStatus;

@RepositoryRestResource(exported = false)
public interface HistoryRouteRepository extends JpaRepository<HistoryRoute, Long>, JpaSpecificationExecutor<HistoryRoute> {

    @Query("select count(r) from HistoryRoute r where r.status = :status and r.user.id = :userId")
    Long countFinishedRoutes(long userId, HistoryRouteStatus status);

    @Query("select sum(r.route.distance) from HistoryRoute r where r.user.id = :userId")
    Long getTotalDistance(Long userId);

    @Query("select sum(r.route.distance) from HistoryRoute r where r.user.id = :userId and r.finishedAt > :startOfDay")
    Long getTotalDayDistance(Long userId, ZonedDateTime startOfDay);

    @Query("select count(r) from HistoryRoute r where r.delta > :delta")
    Long countWhereGreaterDeltaExists(Duration delta);

    @Query("select count(r) from HistoryRoute r where r.user.id = :userId and r.finishedAt > :startOfDay")
    Long countDailyRoutes(Long userId, ZonedDateTime startOfDay);
}
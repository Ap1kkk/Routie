package ru.ngtu.v1.routie.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.model.UserFavoriteRoute;
import ru.ngtu.v1.routie.model.UserFavoriteRouteId;

import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface UserFavoriteRouteRepository extends JpaRepository<UserFavoriteRoute, UserFavoriteRouteId> {

    boolean existsById_UserIdAndId_RouteId(UUID userId, UUID routeId);

    void deleteById_UserIdAndId_RouteId(UUID userId, UUID routeId);

    @Query("SELECT f FROM UserFavoriteRoute f WHERE f.id.userId = :userId ORDER BY f.createdAt DESC")
    Page<UserFavoriteRoute> findAllByUserId(@Param("userId") UUID userId, Pageable pageable);
}

package ru.ngtu.v1.routie.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.model.Route;

import java.util.List;
import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface RouteRepository extends JpaRepository<Route, UUID>, JpaSpecificationExecutor<Route> {

    @Query("SELECT DISTINCT r FROM Route r JOIN r.tagIds t WHERE t IN :tagIds AND r.isActive = true")
    Page<Route> findRecommendedByTags(@Param("tagIds") List<UUID> tagIds, Pageable pageable);
}

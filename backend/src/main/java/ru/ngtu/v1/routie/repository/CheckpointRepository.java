package ru.ngtu.v1.routie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.model.Checkpoint;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface CheckpointRepository extends JpaRepository<Checkpoint, UUID> {

    List<Checkpoint> findAllByRoute_IdOrderBySortOrderAsc(UUID routeId);

    /**
     * Загружает чекпоинты вместе с ландмарками одним запросом (избегает N+1).
     */
    @Query("SELECT c FROM Checkpoint c LEFT JOIN FETCH c.landmark WHERE c.id IN :ids")
    List<Checkpoint> findAllByIdWithLandmark(@Param("ids") Collection<UUID> ids);
}

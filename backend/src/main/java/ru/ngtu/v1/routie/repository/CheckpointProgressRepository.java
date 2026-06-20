package ru.ngtu.v1.routie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.model.CheckpointProgress;
import ru.ngtu.v1.routie.model.RouteSession;

import java.util.Optional;
import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface CheckpointProgressRepository extends JpaRepository<CheckpointProgress, UUID> {

    Optional<CheckpointProgress> findBySessionAndCheckpointId(RouteSession session, UUID checkpointId);
}

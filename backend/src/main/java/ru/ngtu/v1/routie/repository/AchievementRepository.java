package ru.ngtu.v1.routie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.model.Achievement;

import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface AchievementRepository extends JpaRepository<Achievement, UUID> {
}

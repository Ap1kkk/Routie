package ru.ngtu.twosteps.jpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.twosteps.jpa.entity.Achievement;

@RepositoryRestResource(exported = false)
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
}
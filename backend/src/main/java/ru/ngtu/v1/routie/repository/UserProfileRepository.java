package ru.ngtu.v1.routie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.model.UserProfile;
import ru.ngtu.v1.routie.repository.projection.LevelCount;

import java.util.List;
import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {

    /** Распределение пользователей по уровням (для статистики геймификации). */
    @Query("SELECT p.currentLevel AS level, COUNT(p) AS cnt FROM UserProfile p GROUP BY p.currentLevel")
    List<LevelCount> countUsersByLevel();

    /** Средний уровень всех пользователей (для общей сводки). */
    @Query("SELECT COALESCE(AVG(p.currentLevel), 0) FROM UserProfile p")
    Double averageCurrentLevel();
}

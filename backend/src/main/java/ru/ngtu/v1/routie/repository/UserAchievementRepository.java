package ru.ngtu.v1.routie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.model.UserAchievement;
import ru.ngtu.v1.routie.model.UserAchievementId;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface UserAchievementRepository extends JpaRepository<UserAchievement, UserAchievementId> {

    List<UserAchievement> findAllById_UserId(UUID userId);

    @Query("SELECT ua.id.achievementId FROM UserAchievement ua WHERE ua.id.userId = :userId")
    Set<UUID> findUnlockedAchievementIds(@Param("userId") UUID userId);
}

package ru.ngtu.twosteps.jpa.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import ru.ngtu.twosteps.jpa.entity.user.UserAchievement;
import ru.ngtu.twosteps.jpa.entity.user.UserAchievementId;

@RepositoryRestResource(exported = false)
public interface UserAchievementRepository extends JpaRepository<UserAchievement, UserAchievementId> {

    List<UserAchievement> findAllByUser_Id(Long id);

    @Query("select count(ua) from UserAchievement ua where ua.user.id = :userId")
    Long countByUserId(Long userId);

    @Query("select count(ua) from UserAchievement ua where ua.achievement.id = :achievementId and ua.user.id = :userId")
    Long countAchieved(Long achievementId, Long userId);
}
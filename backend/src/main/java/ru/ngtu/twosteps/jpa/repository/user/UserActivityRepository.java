package ru.ngtu.twosteps.jpa.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.twosteps.jpa.entity.user.UserActivity;

@RepositoryRestResource(exported = false)
public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {
}
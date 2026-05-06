package ru.ngtu.twosteps.jpa.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import ru.ngtu.twosteps.jpa.entity.user.UserAvatar;

@RepositoryRestResource(exported = false)
public interface UserAvatarRepository extends JpaRepository<UserAvatar, Long> {

    @Query("select ua.id from UserAvatar ua")
    List<Long> findAllIds();
}
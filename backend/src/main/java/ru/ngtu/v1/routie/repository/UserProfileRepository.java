package ru.ngtu.v1.routie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.model.UserProfile;

import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {
}

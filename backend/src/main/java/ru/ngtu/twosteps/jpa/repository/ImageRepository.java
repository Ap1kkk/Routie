package ru.ngtu.twosteps.jpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;
import java.util.UUID;
import ru.ngtu.twosteps.jpa.entity.Image;

/**
 * @author Egor Bokov
 */
@RepositoryRestResource(exported = false)
public interface ImageRepository extends JpaRepository<Image, Long> {
    Optional<Image> findById(UUID uuid);
}
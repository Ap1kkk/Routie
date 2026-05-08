package ru.ngtu.twosteps.jpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.twosteps.jpa.entity.ImageToClean;

/**
 * @author Egor Bokov
 */
@RepositoryRestResource(exported = false)
public interface ImageToCleanRepository extends JpaRepository<ImageToClean, Long> {
}
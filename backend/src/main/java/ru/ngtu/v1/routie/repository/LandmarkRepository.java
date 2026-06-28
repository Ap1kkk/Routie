package ru.ngtu.v1.routie.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.model.Landmark;

import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface LandmarkRepository extends JpaRepository<Landmark, UUID> {

    Page<Landmark> findAllByTitleContainingIgnoreCase(String title, Pageable pageable);
}

package ru.ngtu.v1.routie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import ru.ngtu.v1.routie.model.MediaFile;

import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface MediaFileRepository extends JpaRepository<MediaFile, UUID> {
}

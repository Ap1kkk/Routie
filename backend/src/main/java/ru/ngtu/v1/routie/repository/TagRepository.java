package ru.ngtu.v1.routie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.model.Tag;

import java.util.List;
import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface TagRepository extends JpaRepository<Tag, UUID> {

    boolean existsByTitleIgnoreCase(String title);

    boolean existsByTitleIgnoreCaseAndIdNot(String title, UUID id);

    List<Tag> findAllByIdIn(List<UUID> ids);
}

package ru.ngtu.v1.routie.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import ru.ngtu.v1.routie.model.User;

import java.util.Optional;
import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Query("""
            SELECT u FROM User u
            LEFT JOIN UserProfile p ON p.userId = u.id
            WHERE u.id <> :currentUserId
              AND (LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<User> searchByUsernameOrName(
            @Param("currentUserId") UUID currentUserId,
            @Param("query") String query,
            Pageable pageable);
}

package ru.ngtu.v1.routie.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.v1.routie.model.Friendship;
import ru.ngtu.v1.routie.model.FriendshipStatus;
import ru.ngtu.v1.routie.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {

    @Query("""
            SELECT f FROM Friendship f
            WHERE f.status = :status
              AND (f.requester = :user OR f.addressee = :user)
            """)
    Page<Friendship> findAllByUserAndStatus(User user, FriendshipStatus status, Pageable pageable);

    @Query("""
            SELECT f FROM Friendship f
            WHERE (f.requester.id = :requesterId AND f.addressee.id = :addresseeId)
               OR (f.requester.id = :addresseeId AND f.addressee.id = :requesterId)
            """)
    Optional<Friendship> findBetweenUsers(UUID requesterId, UUID addresseeId);

    boolean existsByRequesterAndAddresseeAndStatus(User requester, User addressee, FriendshipStatus status);

    /** ID всех принятых друзей пользователя (без самого пользователя). */
    @Query("""
            SELECT CASE WHEN f.requester.id = :userId THEN f.addressee.id ELSE f.requester.id END
            FROM Friendship f
            WHERE f.status = 'ACCEPTED' AND (f.requester.id = :userId OR f.addressee.id = :userId)
            """)
    List<UUID> findAcceptedFriendIds(@Param("userId") UUID userId);
}

package ru.ngtu.v1.routie.dto.profile;

import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendRequestResponse {

    private UUID friendshipId;

    /** Краткий профиль другой стороны запроса (для incoming — отправитель, для outgoing — адресат). */
    private UserProfileShortResponse user;

    private Instant createdAt;
}

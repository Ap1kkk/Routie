package ru.ngtu.v1.routie.repository.projection;

import java.time.Instant;
import java.util.UUID;

public interface UserActivityAggregate {
    UUID getUserId();
    Long getRoutesCompleted();
    Long getTotalDistanceMeters();
    Instant getLastActivityDate();
}

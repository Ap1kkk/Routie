package ru.ngtu.v1.routie.repository.projection;

import java.util.UUID;

public interface RoutePopularityCount {
    UUID getRouteId();
    long getCnt();
}

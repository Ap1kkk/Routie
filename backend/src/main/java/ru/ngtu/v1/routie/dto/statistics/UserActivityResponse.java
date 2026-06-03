package ru.ngtu.v1.routie.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserActivityResponse {

    private UUID userId;
    private String name;
    private String username;
    private Integer currentLevel;
    private Integer totalXp;
    private Integer routesCompleted;
    private Integer totalDistanceMeters;
    private Instant lastActivityDate;
}

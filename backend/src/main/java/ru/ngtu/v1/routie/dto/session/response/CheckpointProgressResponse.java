package ru.ngtu.v1.routie.dto.session.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckpointProgressResponse {

    private UUID checkpointId;
    private Instant reachedAt;
    private Double avgSpeedKmh;
}

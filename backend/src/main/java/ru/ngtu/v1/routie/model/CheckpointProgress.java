package ru.ngtu.v1.routie.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "session_checkpoint_progress",
        uniqueConstraints = @UniqueConstraint(columnNames = {"session_id", "checkpoint_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckpointProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private RouteSession session;

    @Column(name = "checkpoint_id", nullable = false)
    private UUID checkpointId;

    @Column(name = "reached_at", nullable = false)
    private Instant reachedAt;

    @Column(name = "avg_speed_kmh")
    private Double avgSpeedKmh;
}

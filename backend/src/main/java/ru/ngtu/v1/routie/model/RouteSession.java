package ru.ngtu.v1.routie.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import ru.ngtu.v1.routie.dto.session.RouteSessionStatus;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "route_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private UUID routeId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RouteSessionStatus status;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant startedAt;

    private Instant finishedAt;

    private Long totalDurationSeconds;

    private Integer totalDistanceMeters;

    private Double avgSpeedKmh;
}

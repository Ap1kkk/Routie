package ru.ngtu.v1.routie.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "xp_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class XpTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private Integer amount;

    /** Источник начисления, например {@code ROUTE_COMPLETED}, {@code ACHIEVEMENT_UNLOCKED}. */
    @Column(nullable = false, length = 50)
    private String reason;

    /** Необязательная ссылка на сущность-источник (например, ID сессии маршрута). */
    @Column(name = "reference_id")
    private UUID referenceId;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}

package ru.ngtu.v1.routie.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "achievements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_file_id")
    private UUID iconFileId;

    @Column(name = "xp_reward", nullable = false)
    private Integer xpReward;

    /** Какое поле {@link UserProfile} отслеживается для прогресса. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AchievementMetric metric;

    @Column(name = "target_value", nullable = false)
    private Integer targetValue;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}

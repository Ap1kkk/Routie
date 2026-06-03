package ru.ngtu.v1.routie.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String name;
    private String city;

    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private SportType favoriteSportType;

    private String preferredTransport;

    private UUID avatarFileId;

    // Gamification
    @Column(nullable = false)
    @Builder.Default
    private Integer totalXp = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer currentLevel = 1;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalDistanceMeters = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalRoutesCompleted = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalLandmarksVisited = 0;

    @ElementCollection
    @CollectionTable(
            name = "user_preferred_tags",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "tag_id")
    private List<UUID> preferredTagIds;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

package ru.ngtu.v1.routie.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import ru.ngtu.v1.routie.dto.route.RouteType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "routes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RouteType type;

    @Column(nullable = false)
    private Integer difficulty;

    @Column(nullable = false)
    private Integer lengthMeters;

    @Column(nullable = false)
    private Integer estimatedTimeMinutes;

    private String city;

    @Column(nullable = false)
    @Builder.Default
    private Integer completionsCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = false;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<Checkpoint> checkpoints = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "route_images", joinColumns = @JoinColumn(name = "route_id"))
    @Column(name = "file_id")
    @OrderColumn(name = "sort_order")
    @Builder.Default
    private List<UUID> imageFileIds = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "route_tags", joinColumns = @JoinColumn(name = "route_id"))
    @Column(name = "tag_id")
    @Builder.Default
    private List<UUID> tagIds = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}

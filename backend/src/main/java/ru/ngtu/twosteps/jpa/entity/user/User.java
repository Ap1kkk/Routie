package ru.ngtu.twosteps.jpa.entity.user;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.proxy.HibernateProxy;
import ru.ngtu.twosteps.jpa.entity.Achievement;
import ru.ngtu.twosteps.jpa.entity.Category;
import ru.ngtu.twosteps.jpa.BaseEntity;
import ru.ngtu.twosteps.jpa.entity.Region;
import ru.ngtu.twosteps.jpa.entity.route.Route;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * @author Egor Bokov
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@ToString
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column
    private UserGender gender;

    @Column
    private LocalDate birthday;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @CreationTimestamp
    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    // Relationships

    @OneToOne
    @JoinColumn(name = "region_id", referencedColumnName = "id")
    @ToString.Exclude
    private Region region;

    @OneToOne
    @JoinColumn(name = "activity_id", referencedColumnName = "id")
    @ToString.Exclude
    private UserActivity activity;

    @OneToMany
    @JoinTable(
            name = "user_preferences",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "category_id", referencedColumnName = "id")
    )
    @ToString.Exclude
    private List<Category> preferences;

    @OneToMany
    @JoinTable(
            name = "user_achieved_achievements",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "achievement_id", referencedColumnName = "id")
    )
    @ToString.Exclude
    private List<Achievement> achievements;

    @OneToMany
    @JoinTable(
            name = "user_favourite_routes",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "route_id", referencedColumnName = "id")
    )
    @ToString.Exclude
    private List<Route> favouriteRoutes;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "avatar_id", referencedColumnName = "id")
    @ToString.Exclude
    private UserAvatar avatar;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        User user = (User) o;
        return getId() != null && Objects.equals(getId(), user.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }

    public void addRoute(Route route) {
        if(favouriteRoutes == null)
            favouriteRoutes = new ArrayList<>();

        favouriteRoutes.add(route);
    }

    public void removeRoute(Route route) {
        if(favouriteRoutes == null)
            return;

        favouriteRoutes.remove(route);
    }
}
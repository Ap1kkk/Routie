package ru.ngtu.twosteps.jpa.entity.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.proxy.HibernateProxy;
import ru.ngtu.twosteps.jpa.entity.Achievement;

import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * @author Egor Bokov
 */
@Entity
@Table(name = "user_achieved_achievements")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAchievement {

    @EmbeddedId
    @Builder.Default
    private UserAchievementId id = new UserAchievementId();

    @CreationTimestamp
    private ZonedDateTime achievedAt;

    // Relationships

    @ManyToOne
    @MapsId("achievementId")
    @JoinColumn(name = "achievement_id", referencedColumnName = "id")
    private Achievement achievement;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        UserAchievement that = (UserAchievement) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        return Objects.hash(id);
    }
}

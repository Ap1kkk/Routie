package ru.ngtu.twosteps.jpa.entity.route.history;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.proxy.HibernateProxy;
import ru.ngtu.twosteps.jpa.BaseEntity;
import ru.ngtu.twosteps.jpa.entity.route.Route;
import ru.ngtu.twosteps.common.converters.DurationConverter;
import ru.ngtu.twosteps.jpa.entity.user.User;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * @author Egor Bokov
 */
@Entity
@Table(name = "user_routes_history")
@Getter
@Setter
@ToString
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class HistoryRoute extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column
    private HistoryRouteStatus status;

    @Column(name = "started_at")
    @Builder.Default
    private ZonedDateTime startedAt = ZonedDateTime.now();

    @Column(name = "finished_at")
    private ZonedDateTime finishedAt;

    @Convert(converter = DurationConverter.class)
    private Duration delta;

    // Relationships

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "route_id", referencedColumnName = "id")
    private Route route;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        HistoryRoute that = (HistoryRoute) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}

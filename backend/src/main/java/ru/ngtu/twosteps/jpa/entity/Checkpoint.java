package ru.ngtu.twosteps.jpa.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.proxy.HibernateProxy;
import ru.ngtu.twosteps.jpa.BaseEntity;
import ru.ngtu.twosteps.jpa.entity.route.Route;

import java.util.Objects;

/**
 * @author Egor Bokov
 */
@Entity
@Table(name = "checkpoints")
@Getter
@Setter
@ToString
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Checkpoint extends BaseEntity {

    @Column
    @OrderColumn
    private int index;

    @Column
    private float longitude;

    @Column
    private float latitude;

    // Relationships

    @ManyToOne
    @JoinColumn(name = "route_id", referencedColumnName = "id")
    @ToString.Exclude
    @JsonIgnore
    private Route route;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Checkpoint that = (Checkpoint) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
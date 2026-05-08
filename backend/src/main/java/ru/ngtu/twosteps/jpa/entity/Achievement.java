package ru.ngtu.twosteps.jpa.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.proxy.HibernateProxy;
import ru.ngtu.twosteps.jpa.BaseEntity;
import ru.ngtu.twosteps.file.enums.ApplicationTargetDirectory;
import ru.ngtu.twosteps.file.image.handler.ImageToHandle;

import java.util.Objects;

/**
 * @author Egor Bokov
 */
@Entity
@Table(name = "achievements")
@Getter
@Setter
@ToString
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Achievement extends BaseEntity {

    //TODO add icon as path

    @Column
    private String name;

    @Column
    private String description;

    @Column
    private Long goal;

    // Relationships

    @ImageToHandle(
            id = "image",
            directory = ApplicationTargetDirectory.Values.ACHIEVEMENTS_IMAGES_VALUE
    )
    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "achievement_images",
            joinColumns = @JoinColumn(
                    name = "achievement_id",
                    referencedColumnName = "id"
            ),
            inverseJoinColumns = @JoinColumn(
                    name = "image_id",
                    referencedColumnName = "id"
            )
    )
    @ToString.Exclude
    private Image image;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Achievement that = (Achievement) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}

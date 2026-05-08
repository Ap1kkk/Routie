package ru.ngtu.twosteps.jpa.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.ngtu.twosteps.jpa.entity.ImageInfo;

@Repository
public interface ImageInfoRepository extends JpaRepository<ImageInfo, UUID> {

}

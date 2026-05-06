
package ru.ngtu.twosteps.jpa.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Component;
import ru.ngtu.twosteps.jpa.entity.ImageInfo;

@Component
public class ImageInfoRepositoryFacade extends EntityRepositoryFacade<ImageInfo, UUID, ImageInfoRepository> {

  public ImageInfoRepositoryFacade(ImageInfoRepository repository) {
    super(repository, ImageInfo.class);
  }
}

package ru.ngtu.v1.routie.dto.route.response;

import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LandmarkShortResponse {

  private UUID id;
  private String title;
  private String description;
  private List<MediaFileResponse> images;
  private AudioGuideResponse audioGuide;
}

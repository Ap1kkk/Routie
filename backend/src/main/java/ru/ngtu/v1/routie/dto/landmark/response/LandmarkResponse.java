package ru.ngtu.v1.routie.dto.landmark.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.audioguide.response.AudioGuideResponse;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LandmarkResponse {

  private UUID id;
  private String title;
  private String description;
  private List<MediaFileResponse> images;
  private AudioGuideResponse audioGuide;
}

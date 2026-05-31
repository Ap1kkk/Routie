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
public class RouteShortResponse {

  private UUID id;
  private String title;
  private String description;
  private String type;
  private Integer difficulty;
  private Integer lengthMeters;
  private Integer estimatedTimeMinutes;
  private String city;
  private Integer completionsCount;
  private Boolean isActive;
  private List<MediaFileResponse> images;
}

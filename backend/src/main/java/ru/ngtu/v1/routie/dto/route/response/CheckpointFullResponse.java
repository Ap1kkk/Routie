package ru.ngtu.v1.routie.dto.route.response;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckpointFullResponse {

  private UUID id;
  private Double latitude;
  private Double longitude;
  private Integer sortOrder;
  private LandmarkShortResponse landmark;
}

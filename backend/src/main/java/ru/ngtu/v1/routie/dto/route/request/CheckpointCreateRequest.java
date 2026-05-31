package ru.ngtu.v1.routie.dto.route.request;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckpointCreateRequest {

  @NotNull
  private Double latitude;

  @NotNull
  private Double longitude;

  @NotNull
  private Integer sortOrder;

  private UUID landmarkId;
}

package ru.ngtu.v1.routie.dto.route.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.v1.routie.dto.route.RouteType;
import ru.ngtu.v1.routie.dto.route.request.CheckpointCreateRequest;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteCreateRequest {

  @NotBlank
  private String title;

  @NotBlank
  private String description;

  @NotNull
  private RouteType type;

  @NotNull
  @Min(1)
  @Max(5)
  private Integer difficulty;

  @NotNull
  private Integer lengthMeters;

  @NotNull
  private Integer estimatedTimeMinutes;

  private String city;

  @NotEmpty
  @Valid
  private List<CheckpointCreateRequest> checkpoints;
}

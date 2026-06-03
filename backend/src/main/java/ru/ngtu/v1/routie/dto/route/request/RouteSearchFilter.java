package ru.ngtu.v1.routie.dto.route.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class RouteSearchFilter {

  private String search;

  private String type;

  @Min(1)
  @Max(5)
  private Integer difficultyMin;

  @Min(1)
  @Max(5)
  private Integer difficultyMax;

  @Min(0)
  private Integer lengthMin;

  @Min(0)
  private Integer lengthMax;

  @Min(0)
  private Integer estimatedTimeMin;

  @Min(0)
  private Integer estimatedTimeMax;

  private String city;

  private String tags;

  private Boolean hasAudioGuide;

  private Boolean favoriteOnly;

  @Min(0)
  private int page = 0;

  @Min(1)
  @Max(100)
  private int size = 20;

  private String sort;
}

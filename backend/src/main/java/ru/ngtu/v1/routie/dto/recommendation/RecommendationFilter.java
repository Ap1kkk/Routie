package ru.ngtu.v1.routie.dto.recommendation;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class RecommendationFilter {

    @Min(0)
    private int page = 0;

    @Min(1)
    @Max(100)
    private int size = 20;

    private String type;

    @Min(1)
    @Max(5)
    private Integer difficultyMin;

    @Min(1)
    @Max(5)
    private Integer difficultyMax;

    private String city;
}

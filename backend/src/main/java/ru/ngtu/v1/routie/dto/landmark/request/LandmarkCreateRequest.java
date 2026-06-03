package ru.ngtu.v1.routie.dto.landmark.request;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;
import lombok.Data;

@Data
public class LandmarkCreateRequest {

    @NotBlank
    private String title;

    private String description;

    private UUID audioGuideId;
}

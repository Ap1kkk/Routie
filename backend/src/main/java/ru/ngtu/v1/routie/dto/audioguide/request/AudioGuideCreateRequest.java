package ru.ngtu.v1.routie.dto.audioguide.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AudioGuideCreateRequest {

    @NotBlank
    private String title;

    @Min(1)
    private Integer durationSeconds;
}

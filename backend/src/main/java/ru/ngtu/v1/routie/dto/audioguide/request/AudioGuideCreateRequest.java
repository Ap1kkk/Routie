package ru.ngtu.v1.routie.dto.audioguide.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AudioGuideCreateRequest {

    @NotBlank
    private String title;

    @Min(1)
    private Integer durationSeconds;
}

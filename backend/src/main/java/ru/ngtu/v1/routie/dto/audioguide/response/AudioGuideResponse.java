package ru.ngtu.v1.routie.dto.audioguide.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AudioGuideResponse {

    private UUID id;
    private String title;
    private Integer durationSeconds;
    private MediaFileResponse file;
}

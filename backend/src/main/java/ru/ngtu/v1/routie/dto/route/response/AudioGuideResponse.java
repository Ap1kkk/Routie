package ru.ngtu.v1.routie.dto.route.response;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AudioGuideResponse {

  private UUID id;
  private String title;
  private Integer durationSeconds;
  private MediaFileResponse file;
}

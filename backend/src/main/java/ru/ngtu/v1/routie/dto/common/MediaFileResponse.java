package ru.ngtu.v1.routie.dto.common;

import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaFileResponse {

  private UUID id;
  private String filename;
  private String contentType;
  private Instant createTs;
  private int sortOrder;
}
package ru.ngtu.v1.routie.dto.tag;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagResponse {

  private UUID id;
  private String title;
}

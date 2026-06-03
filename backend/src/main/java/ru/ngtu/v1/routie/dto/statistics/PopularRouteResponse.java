package ru.ngtu.v1.routie.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PopularRouteResponse {

    private UUID routeId;
    private String title;
    private String type;
    private Integer completionsCount;
    private String city;
}

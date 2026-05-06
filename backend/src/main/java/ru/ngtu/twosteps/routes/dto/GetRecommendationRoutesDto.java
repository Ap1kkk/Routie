package ru.ngtu.twosteps.routes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ngtu.twosteps.jpa.entity.route.RouteFilter;

/**
 * @author Egor Bokov
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetRecommendationRoutesDto {
    private Long userId;
    private RouteFilter filter;
}

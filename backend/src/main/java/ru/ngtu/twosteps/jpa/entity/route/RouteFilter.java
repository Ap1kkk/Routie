package ru.ngtu.twosteps.jpa.entity.route;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @author Egor Bokov
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteFilter {
    private RouteFilterOrder order = RouteFilterOrder.DESC;
    private List<RouteDifficulty> difficulties;
    private List<Long> categoryIds;
    private Long durationFrom;
    private Long durationTo;
    private Long distanceFrom;
    private Long distanceTo;
}

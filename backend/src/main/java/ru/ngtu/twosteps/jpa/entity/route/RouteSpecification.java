package ru.ngtu.twosteps.jpa.entity.route;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import ru.ngtu.twosteps.jpa.entity.Category;

/**
 * @author Egor Bokov
 */
public class RouteSpecification {

    public static Specification<Route> withFilters(RouteFilter filter) {
        return withFilters(null, filter);
    }

    public static Specification<Route> withFilters(String searchQuery, RouteFilter filter) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            // Фильтр по имени маршрута
            if (searchQuery != null && !searchQuery.trim().isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + searchQuery.toLowerCase() + "%"));
            }

            // Фильтр по сложностям
            if (filter.getDifficulties() != null && !filter.getDifficulties().isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        root.get("difficulty").in(filter.getDifficulties()));
            }

            // Фильтр по категориям
            if (filter.getCategoryIds() != null && !filter.getCategoryIds().isEmpty()) {
                Join<Route, Category> categories = root.join("categories");
                predicate = criteriaBuilder.and(predicate,
                        categories.get("id").in(filter.getCategoryIds()));
            }

            // Фильтр по длительности
            if (filter.getDurationFrom() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.greaterThanOrEqualTo(root.get("duration"), filter.getDurationFrom()));
            }
            if (filter.getDurationTo() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.lessThanOrEqualTo(root.get("duration"), filter.getDurationTo()));
            }

            // Фильтр по расстоянию
            if (filter.getDistanceFrom() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.greaterThanOrEqualTo(root.get("distance"), filter.getDistanceFrom()));
            }
            if (filter.getDistanceTo() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.lessThanOrEqualTo(root.get("distance"), filter.getDistanceTo()));
            }

            // Применение сортировки по дате
            if (filter.getOrder() != null) {
                if (filter.getOrder() == RouteFilterOrder.ASC) {
                    query.orderBy(criteriaBuilder.asc(root.get("createdAt")));
                } else if (filter.getOrder() == RouteFilterOrder.DESC) {
                    query.orderBy(criteriaBuilder.desc(root.get("createdAt")));
                }
            }

            return predicate;
        };
    }
}

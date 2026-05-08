package ru.ngtu.twosteps.routes.mappers;

import org.mapstruct.*;
import ru.ngtu.twosteps.routes.dto.RouteDto;
import ru.ngtu.twosteps.jpa.entity.route.Route;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface RouteMapper {
    Route toEntity(RouteDto routeDto);

    @AfterMapping
    default void linkCheckpoints(@MappingTarget Route route) {
        route.getCheckpoints().forEach(checkpoint -> checkpoint.setRoute(route));
    }

    RouteDto toDto(Route route);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Route partialUpdate(RouteDto routeDto, @MappingTarget Route route);
}
package ru.ngtu.twosteps.user.mappers;

import org.mapstruct.*;
import ru.ngtu.twosteps.user.dto.UserProjectionDto;
import ru.ngtu.twosteps.jpa.entity.user.User;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserProjectionMapper {
    User toEntity(UserProjectionDto userProjectionDto);

    UserProjectionDto toDto(User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    User partialUpdate(UserProjectionDto userProjectionDto, @MappingTarget User user);
}
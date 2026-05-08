package ru.ngtu.twosteps.category;

import lombok.Value;
import ru.ngtu.twosteps.jpa.entity.Category;

/**
 * DTO for {@link Category}
 */
@Value
public class CategoryDto {
    Long id;
    String name;
}
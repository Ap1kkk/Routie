package ru.ngtu.twosteps.common.exceptions.classes;

import lombok.Getter;
import ru.ngtu.twosteps.common.utils.StringUtils;

@Getter
public class EntityNotFoundException extends jakarta.persistence.EntityNotFoundException {

  private final Class<?> clazz;
  private final Object field;
  private final Object value;

  public EntityNotFoundException(Class<?> clazz, Object field, Object value) {
    super(ErrorMessage.NOT_FOUND_BY.getErrorMessage()
        .formatted(StringUtils.formatClassName(clazz), field, value));
    this.clazz = clazz;
    this.field = field;
    this.value = value;
  }
}

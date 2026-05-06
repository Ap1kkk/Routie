package ru.ngtu.twosteps.common.exceptions.classes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
public class NestedValidationContext extends ValidationContext {

  private String name;
}

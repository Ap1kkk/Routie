package ru.ngtu.twosteps.common.exceptions;


import java.util.function.Supplier;
import ru.ngtu.twosteps.common.exceptions.classes.BadArgumentsException;
import ru.ngtu.twosteps.common.exceptions.classes.EntityNotFoundException;

public class ErrorText {

  public static final String NOT_FOUND_BY = "%s not found by %s with value (%s)";

//  public static void badArg(ErrorMessage e, Object... args) {
//    throw buildBadArg(e, args);
//  }

  public static void badArg(String message, Object... args) {
    throw buildBadArg(message, args);
  }

  public static BadArgumentsException buildBadArg(String message, Object... args) {
    return new BadArgumentsException(String.format(message, args));
  }

//  public static BadArgumentsException buildBadArg(ErrorMessage e, Object... args) {
//    return new BadArgumentsException(String.format(e.getErrorMessage(), args),
//        String.format(e.getErrorMessageDisplay(), args));
//  }

  public static Supplier<? extends EntityNotFoundException> notFoundById(Class<?> clazz,
      Object id) {
    return () -> buildENFE(clazz, "id", id);
  }

  public static Supplier<? extends EntityNotFoundException> notFoundBy(Class<?> clazz, Object field,
      Object value) {
    return () -> buildENFE(clazz, field, value);
  }

  public static void notFound(Class<?> clazz, Object field,
      Object value) {
    throw buildENFE(clazz, field, value);
  }

  public static EntityNotFoundException buildENFE(Class<?> clazz, Object field,
      Object value) {
    return new EntityNotFoundException(clazz, field, value);
  }
}

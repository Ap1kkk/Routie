package ru.ngtu.twosteps.common.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import ru.ngtu.twosteps.jpa.entity.EntityLogView;
import ru.ngtu.twosteps.jpa.entity.IdHaving;

public class StreamUtils {

  public static Set<UUID> getIdSet(Collection<? extends IdHaving> collection) {
    if (collection == null) {
      return new HashSet<>();
    }
    return collection.stream().map(IdHaving::getId).collect(Collectors.toSet());
  }

  public static <T> Set<UUID> getIdSet(Collection<? extends T> collection,
      Function<T, UUID> getIdFunction) {
    if (collection == null) {
      return new HashSet<>();
    }
    return collection.stream().map(getIdFunction).collect(Collectors.toSet());
  }

  public static List<String> getEntityLogViews(Collection<? extends EntityLogView> collection) {
    if (collection == null) {
      return new ArrayList<>();
    }
    return collection.stream().map(EntityLogView::getLogView).collect(Collectors.toList());
  }

  public static boolean containsAny(Set<UUID> source, Set<UUID> target) {
    if (CollectionUtils.isEmpty(source) || CollectionUtils.isEmpty(target)) {
      return false;
    }
    return source.stream().anyMatch(target::contains);
  }

  public static <T> List<T> getFiltered(Collection<T> collection, Predicate<T> predicate) {
    if (collection == null) {
      return new ArrayList<>();
    }
    return collection.stream().filter(predicate).collect(Collectors.toList());
  }
}

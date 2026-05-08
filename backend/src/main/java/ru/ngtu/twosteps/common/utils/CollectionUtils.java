package ru.ngtu.twosteps.common.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

public class CollectionUtils {

  public static boolean isEmpty(Collection<?> collection) {
    return collection == null || collection.isEmpty();
  }

  public static boolean isEmpty(String[] valueList) {
    return valueList == null || valueList.length == 0;
  }

  public static boolean isNotEmpty(Collection<?> collection) {
    return !isEmpty(collection);
  }

  public static boolean isNotEmpty(String[] valueList) {
    return !isEmpty(valueList);
  }

  public static boolean areSameSize(Object[] a1, Object[] a2) {
    if (a1 == null || a2 == null) {
      return false;
    }
    return a1.length == a2.length;
  }

  public static boolean areNotSameSize(Object[] a1, Object[] a2) {
    return !areSameSize(a1, a2);
  }

  public static boolean areSameSize(Collection<?> c1, Collection<?> c2) {
    if (c1 == null || c2 == null) {
      return false;
    }
    return c1.size() == c2.size();
  }

  public static boolean areNotSameSize(Collection<?> c1, Collection<?> c2) {
    return !areSameSize(c1, c2);
  }

  public static boolean containsAny(Set<UUID> excludedIds, Set<UUID> modelIds) {
    return org.apache.commons.collections4.CollectionUtils.containsAny(excludedIds, modelIds);
  }

  @SafeVarargs
  public static <T> List<T> getListOf(T... elements) {
    return new ArrayList<>(List.of(elements));
  }

  public static <T> List<T> getMutableList(List<T> list) {
    return new ArrayList<>(list);
  }

  public static String[] getArrayOf(String... args) {
    return List.of(args).toArray(new String[args.length]);
  }

  public static <T, K, V> Map<K, V> toMap(Collection<T> collection, Function<T, K> keyMapper,
      Function<T, V> valueMapper) {
    if (isEmpty(collection)) {
      return new HashMap<>();
    }
    return collection.stream()
        .collect(Collectors.toMap(keyMapper, valueMapper));
  }

  public static <T> void updateList(List<T> c1, List<T> c2) {
    if (c1 == null) {
      c1 = new ArrayList<>();
    }
    c1.clear();
    if (CollectionUtils.isNotEmpty(c2)) {
      c1.addAll(c2);
    }
  }
}

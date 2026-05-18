package ru.ngtu.twosteps.common.utils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;

public class HashUtils {


  public static int getHash(UUID uuid) {
    return uuid != null ? uuid.hashCode() : 0;
  }

  public static int getHash(String value) {
    return value != null ? value.hashCode() : 0;
  }

  public static int getHash(Integer launchesCount) {
    return launchesCount != null ? launchesCount : 0;
  }

  public static int getHash(Boolean selectedByDefault) {
    return selectedByDefault ? 1 : 0;
  }

  public static <T> int hashCollection(final int initialHash, List<T> collection,
      Comparator<T> comparator,
      Function<T, Integer> hashFunction) {
    int hash = initialHash;
    if (CollectionUtils.isNotEmpty(collection)) {
      List<T> sortedCollection = new ArrayList<>(collection);
      sortedCollection.sort(comparator);
      for (T item : sortedCollection) {
        if (item != null) {
          hash = 31 * hash + hashFunction.apply(item);
        }
      }
    }
    return hash;
  }

  public static <T> Comparator<T> getComparatorByField(Function<T, Object> fieldGetter) {
    return Comparator.comparing(p -> getFieldToSort(p, fieldGetter.apply(p)));
  }

  public static <T> String getFieldToSort(T p, Object field) {
    return p != null && field != null ? field.toString() : "";
  }
}

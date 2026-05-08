package ru.ngtu.twosteps.common.utils;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.apache.logging.log4j.util.Strings;

public class
StringUtils {

  public static final Pattern ARRAY_PATTERN = Pattern.compile("\\[.*]");

  public static String formatClassName(Class<?> clazz) {
    String className = clazz.getSimpleName();
    if (className.isEmpty()) {
      return className;
    }
    String withSpaces = className.replaceAll(
        "(?<=\\p{Ll})(?=\\p{Lu})|(?<=\\p{Lu})(?=\\p{Lu}[\\p{Ll}])", " ");
    return withSpaces.substring(0, 1) + withSpaces.substring(1).toLowerCase();
  }

  public static boolean matchesArrayPattern(String value) {
    return ARRAY_PATTERN.matcher(value).matches();
  }

  public static boolean notMatchesArrayPattern(String value) {
    return !matchesArrayPattern(value);
  }

  public static String[] extractArrayValues(String arrayString) {
    String listString = arrayString.substring(1, arrayString.length() - 1);
    return listString.split(",");
  }

  public static Integer parseInt(String value) {
    if (Strings.isBlank(value)) {
      return null;
    }
    return Integer.parseInt(value);
  }

  public static Double parseDecimal(String value) {
    if (Strings.isBlank(value)) {
      return null;
    }
    return Double.parseDouble(value);
  }

  public static List<Double> extractDoubleArray(String[] input) {
    return Arrays.stream(input)
        .map(s -> Double.parseDouble(s.trim()))
        .collect(Collectors.toList());
  }
  public static List<Double> extractDoubleArray(String input) {
    if (Strings.isBlank(input)) {
      return null;
    }
    return extractDoubleArray(extractArrayValues(input));
  }

  public static List<Integer> extractIntegerArray(String[] input) {
    return Arrays.stream(input)
        .map(s -> Integer.parseInt(s.trim()))
        .collect(Collectors.toList());
  }

  public static List<Integer> extractIntegerArray(String input) {
    if (Strings.isBlank(input)) {
      return null;
    }
    return extractIntegerArray(extractArrayValues(input));
  }

  public static boolean isBlank(CharSequence cs) {
    return org.apache.commons.lang3.StringUtils.isBlank(cs);
  }

  public static boolean isNotBlank(CharSequence cs) {
    return !isBlank(cs);
  }

  public static String requireNotBlankElse(String value, String defaultValue) {
    return isNotBlank(value) ? value : defaultValue;
  }

  public static String maskString(String str) {
    if (org.apache.commons.lang3.StringUtils.isEmpty(str)) {
      return str;
    }
    if (str.length() <= 3) {
      return org.apache.commons.lang3.StringUtils.repeat('x', str.length());
    } else if (str.length() <= 5) {
      return str.substring(0, 1) + org.apache.commons.lang3.StringUtils.repeat('x',
          str.length() - 2) + str.substring(str.length() - 1);
    } else {
      return str.substring(0, 2) + org.apache.commons.lang3.StringUtils.repeat('x',
          str.length() - 4) + str.substring(str.length() - 2);
    }
  }
}

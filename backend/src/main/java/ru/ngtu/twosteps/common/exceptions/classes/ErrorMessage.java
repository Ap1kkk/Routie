package ru.ngtu.twosteps.common.exceptions.classes;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorMessage {
  INTERNAL_ERROR("An unexpected error occurred on the server", "Непредвиденная ошибка"),
  NOT_FOUND_BY("%s not found by %s with value (%s)", "%s не найдено по %s c значением (%s)"),
  NOT_AUTHORIZED("You are not authorized. Authorization is required",
      "Ошибка авторизации. Пожалуйста авторизуйтесь в системе и повторите запрос"),
  ACCESS_DENIED("You do not have permission to perform this action",
      "У вас недостаточно прав доступа для осуществления данной операции"),
  METHOD_NOT_ALLOWED("The requested method is not allowed",
      "Запрашиваемый метод не может быть обработан сервером"),
  PAYLOAD_TOO_LARGE("The request size exceeds the allowed limit",
      "Слишком большое тело запроса"),

  SCENARIO_NAME_ALREADY_EXISTS("Scenario name already exists",
      "Сценарий с таким именем уже существует"),

  SCENARIO_PARAMS_MUST_NOT_BE_EMPTY("Scenario params must not be empty",
      "Параметры сценария не должны быть пустыми"),
  SAME_SCENARIO_ALREADY_EXISTS("Same scenario already exists: %s",
      "Такой сценарий уже существует: %s"),

  DASHBOARD_HAS_NO_ACTIVE_DASHBOARD_RULE("Dashboard has no active dashboard rule",
      "У дашборда нет активного правила"),

  NOT_ALL_PARAMETER_GROUPS_HAVE_FOUND("Not all parameter groups have found",
      "Не все группы параметров найдены"),

  USER_DO_NOT_HAVE_PERMISSION_TO_DELETE_SCENARIO("User do not have permission to delete scenario",
      "Недостаточно прав для удаления сценария"),
  USER_DOES_NOT_HAVE_PERMISSION_TO_SHARE_THIS_SCENARIO(
      "User does not have permission to share this scenario",
      "Недостаточно прав чтобы поделиться этим сценарием"),

  UNABLE_TO_UPDATE_SCENARIO_DUE_TO_DASHBOARD_CONFIG_IS_NOT_ACTIVE(
      "Unable to update scenario due dashboard config is not active",
      "Невозможно обновить сценарий: конфигурация правила дашборда не актуальна"),
  UNABLE_TO_UPDATE_SCENARIO_DUE_TO_NO_DASHBOARD_CONFIG_ID_FOUND(
      "Unable to update scenario due to no dashboard config id found",
      "Невозможно обновить сценарий: id конфигурации правила дашборда не найден"),

  IS_NOT_A_FEATURE("Model param %s is not a feature",
      "Параметр %s не является фичей"),
  DEFAULT_FEATURE_SOURCE_ALREADY_EXISTS("Default feature source already exits: %s",
      "Источник фичи по умолчанию уже существует: %s");

  private final String errorMessage;
  private final String errorMessageDisplay;
}

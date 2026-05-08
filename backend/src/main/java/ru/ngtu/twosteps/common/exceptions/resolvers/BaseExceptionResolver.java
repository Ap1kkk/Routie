package ru.ngtu.twosteps.common.exceptions.resolvers;

import ru.ngtu.twosteps.common.exceptions.classes.AppException;
import ru.ngtu.twosteps.common.exceptions.messages.AppExceptionMessage;

/**
 * @author Egor Bokov
 */
public abstract class BaseExceptionResolver {

    public AppExceptionMessage buildMessage(AppException e) {
        return AppExceptionMessage
                .builder()
                .reason(e.getReason().getReason())
                .message(e.getMessage())
                .status(e.getReason().getStatus().value())
                .details(e.getDetails())
                .build();
    }
}

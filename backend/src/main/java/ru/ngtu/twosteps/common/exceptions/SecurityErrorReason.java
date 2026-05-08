package ru.ngtu.twosteps.common.exceptions;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import ru.ngtu.twosteps.common.exceptions.reasons.ErrorReason;

/**
 * {@link ErrorReason} implementation for security errors
 * @author Egor Bokov
 */
@Getter
@RequiredArgsConstructor
public enum SecurityErrorReason implements ErrorReason {
    JWT_EXPIRED("jwt_expired", HttpStatus.UNAUTHORIZED);


    private final String reason;
    private final HttpStatus status;
}

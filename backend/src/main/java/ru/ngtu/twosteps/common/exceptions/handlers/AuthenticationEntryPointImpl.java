package ru.ngtu.twosteps.common.exceptions.handlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import ru.ngtu.twosteps.common.exceptions.messages.AppExceptionMessage;
import ru.ngtu.twosteps.common.exceptions.reasons.DefaultErrorReason;

import java.io.IOException;

/**
 * Used for authentication security filter exception handling
 * @author Egor Bokov
 */
@Component
public class AuthenticationEntryPointImpl extends BaseFilterExceptionHandler implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        AppExceptionMessage appExceptionMessage = build(DefaultErrorReason.ACCESS_DENIED, authException.getMessage(), request.getRequestURI());

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write(new ObjectMapper().writeValueAsString(appExceptionMessage));
    }
}

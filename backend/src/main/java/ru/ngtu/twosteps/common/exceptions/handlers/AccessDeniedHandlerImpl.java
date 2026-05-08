package ru.ngtu.twosteps.common.exceptions.handlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import ru.ngtu.twosteps.common.exceptions.messages.AppExceptionMessage;
import ru.ngtu.twosteps.common.exceptions.reasons.DefaultErrorReason;

import java.io.IOException;

/**
 * Used for security filter exception handling
 * @author Egor Bokov
 */
@Component
public class AccessDeniedHandlerImpl extends BaseFilterExceptionHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException {
        AppExceptionMessage appExceptionMessage = build(DefaultErrorReason.ACCESS_DENIED, accessDeniedException.getMessage(), request.getRequestURI());

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write(new ObjectMapper().writeValueAsString(appExceptionMessage));
    }
}

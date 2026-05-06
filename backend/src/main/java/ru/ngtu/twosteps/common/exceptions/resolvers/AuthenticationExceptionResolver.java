package ru.ngtu.twosteps.common.exceptions.resolvers;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;
import ru.ngtu.twosteps.common.exceptions.classes.security.AuthenticationException;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * Resolver for handling exceptions in filters
 */
@Slf4j
@Component
public class AuthenticationExceptionResolver extends BaseExceptionResolver implements HandlerExceptionResolver {
    @Override
    public ModelAndView resolveException(
            HttpServletRequest request,
            HttpServletResponse response,
            Object object,
            Exception exception) {

        try (PrintWriter writer = response.getWriter()) {
            log.error(exception.getMessage());

            ObjectMapper objectMapper = new ObjectMapper();
            AuthenticationException authenticationException = new AuthenticationException(exception.getMessage());

            String json = objectMapper
                    .writeValueAsString(
                            buildMessage(authenticationException)
                    );
            writer.write(json);

            response.setStatus(AuthenticationException.STATUS_VALUE);
            response.setContentType("application/json");
        } catch (IOException ioException) {
            log.error("Error writing JSON response", ioException);
        }

        return new ModelAndView(new MappingJackson2JsonView());
    }

}

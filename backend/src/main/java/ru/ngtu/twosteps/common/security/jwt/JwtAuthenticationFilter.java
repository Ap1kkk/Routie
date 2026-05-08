package ru.ngtu.twosteps.common.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import ru.ngtu.twosteps.common.config.JwtConfigProperties;
import ru.ngtu.twosteps.common.exceptions.resolvers.AuthenticationExceptionResolver;

import java.io.IOException;

/**
 * Authentication filter.
 * Recognizes JWT Bearer token in request headers and validates it
 * @author Egor Bokov
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    public static final String BEARER_PREFIX = "Bearer ";
    
    private final JwtConfigProperties jwtConfigProperties;

    private final JwtAuthenticationProvider jwtTokenProvider;
    private final AuthenticationExceptionResolver exceptionResolver;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String authHeader = request.getHeader(jwtConfigProperties.getHeader());

        if(!StringUtils.hasLength(authHeader)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token;

        if(StringUtils.startsWithIgnoreCase(authHeader, BEARER_PREFIX))
            token = authHeader.substring(BEARER_PREFIX.length());
        else
            token = authHeader;

        try {
            String username = jwtTokenProvider.getUsername(token);

            if(StringUtils.hasText(username) && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtTokenProvider.validateToken(token)) {
                    Authentication authentication = jwtTokenProvider.getAuthentication(token);
                    if (authentication != null)
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
            exceptionResolver.resolveException(request, response, null, e);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
package ru.ngtu.v1.routie.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import ru.ngtu.v1.routie.config.properties.TestTokenProperties;
import ru.ngtu.v1.routie.model.User;
import ru.ngtu.v1.routie.repository.UserRepository;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Фильтр тестовой аутентификации.
 * Активен только при профиле {@code test}.
 * <p>
 * Перехватывает Bearer-токены и, если токен найден в {@link TestTokenProperties},
 * устанавливает аутентификацию от имени соответствующего пользователя.
 * JWT-фильтр при этом пропускается (контекст уже заполнен).
 */
@Slf4j
@Component
@Profile("test")
public class TestTokenAuthFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    /** token → userId: строится один раз при старте */
    private final Map<String, UUID> tokenToUserId;
    private final UserRepository userRepository;

    public TestTokenAuthFilter(TestTokenProperties props, UserRepository userRepository) {
        this.userRepository = userRepository;
        this.tokenToUserId = props.getTokens().stream()
                .collect(Collectors.toMap(
                        TestTokenProperties.TestTokenEntry::getToken,
                        TestTokenProperties.TestTokenEntry::getUserId
                ));
        log.info("[TEST] TestTokenAuthFilter initialized with {} test token(s)", tokenToUserId.size());
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(BEARER_PREFIX.length());
        UUID userId = tokenToUserId.get(token);

        if (userId == null) {
            // Не тестовый токен — пусть обрабатывает JwtAuthenticationFilter
            filterChain.doFilter(request, response);
            return;
        }

        // Контекст уже установлен другим фильтром — пропускаем
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalStateException(
                            "Test token references unknown userId: " + userId));

            CustomUserDetails userDetails = new CustomUserDetails(user);

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(auth);

            log.debug("[TEST] Authenticated via test token: userId={}, role={}",
                    userId, userDetails.getAuthorities());
        } catch (Exception e) {
            log.warn("[TEST] Failed to authenticate with test token: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}

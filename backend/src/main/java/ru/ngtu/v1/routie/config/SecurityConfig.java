package ru.ngtu.v1.routie.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import ru.ngtu.v1.routie.config.properties.CorsConfigProperties;
import ru.ngtu.v1.routie.config.properties.JwtConfigProperties;

/**
 * @author Egor Bokov
 */
@Configuration
@EnableConfigurationProperties({
    JwtConfigProperties.class,
    CorsConfigProperties.class
})
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  @Bean
  public CorsConfigurationSource corsConfigurationSource(CorsConfigProperties corsProperties) {
    CorsConfiguration configuration = new CorsConfiguration();

    configuration.addAllowedOrigin(corsProperties.getAllowedOrigin());
    configuration.addAllowedHeader(corsProperties.getAllowedHeader());
    configuration.addAllowedMethod(corsProperties.getAllowedMethod());

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration(corsProperties.getConfigurationPattern(), configuration);

    return source;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(
      HttpSecurity http,
      CorsConfigurationSource corsConfigurationSource
  ) throws Exception {
    http
        .cors(cors ->
            cors.configurationSource(corsConfigurationSource)
        )
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests((request) ->
            request
                .anyRequest()
                .permitAll()
        );
    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
  }

}

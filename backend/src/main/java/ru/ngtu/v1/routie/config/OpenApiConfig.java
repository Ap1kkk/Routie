package ru.ngtu.v1.routie.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Egor Bokov
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public GroupedOpenApi fullApi() {
        return GroupedOpenApi.builder()
                .group("full api")
                .pathsToMatch("/**")
                .build();
    }
}
package ru.ngtu.v1.routie.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.tags.Tag;
import org.springdoc.core.customizers.GlobalOpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Configuration
public class OpenApiConfig {

    private static final List<String> TAG_ORDER = List.of(
            "Auth",
            "Profile",
            "Routes",
            "Recommendations",
            "Sessions",
            "Landmarks",
            "Audio Guides",
            "Tags",
            "Friends",
            "File"
    );

    @Bean
    public GlobalOpenApiCustomizer tagOrderCustomizer() {
        return this::reorderTags;
    }

    private void reorderTags(OpenAPI openApi) {
        if (openApi.getTags() == null) return;

        Map<String, Integer> order = new java.util.HashMap<>();
        for (int i = 0; i < TAG_ORDER.size(); i++) {
            order.put(TAG_ORDER.get(i), i);
        }

        openApi.getTags().sort(
                Comparator.comparingInt(tag -> order.getOrDefault(tag.getName(), Integer.MAX_VALUE))
        );
    }
}

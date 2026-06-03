package ru.ngtu.v1.routie.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springdoc.core.customizers.GlobalOpenApiCustomizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Configuration
public class OpenApiConfig {

  private static final String SECURITY_SCHEME_NAME = "bearerAuth";

  @Value("${server.protocol:http}")
  private String protocol;

  @Value("${server.host:localhost}")
  private String host;

  @Value("${server.port:8080}")
  private int port;

  private static final List<String> TAG_ORDER = List.of(
      "Auth",
      "Profile",
      "Friends",
      "Routes",
      "Recommendations",
      "Gamification",
      "Sessions",
      "Landmarks",
      "Audio Guides",
      "Tags",
      "Statistics",
      "File"
  );

  @Bean
  public OpenAPI openAPI() {
    boolean isDefaultPort = ("http".equals(protocol) && port == 80)
        || ("https".equals(protocol) && port == 443);

    String url = isDefaultPort
        ? protocol + "://" + host
        : protocol + "://" + host + ":" + port;

    Server server = new Server()
        .url(url)
        .description("API сервер");

    return new OpenAPI()
        .addServersItem(server)
        .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
        .components(new Components()
            .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                .name(SECURITY_SCHEME_NAME)
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
            )
        );
  }

  @Bean
  public GlobalOpenApiCustomizer tagOrderCustomizer() {
    return this::reorderTags;
  }

  private void reorderTags(OpenAPI openApi) {
    if (openApi.getTags() == null) {
      return;
    }

    Map<String, Integer> order = new java.util.HashMap<>();
    for (int i = 0; i < TAG_ORDER.size(); i++) {
      order.put(TAG_ORDER.get(i), i);
    }

    openApi.getTags().sort(
        Comparator.comparingInt(tag -> order.getOrDefault(tag.getName(), Integer.MAX_VALUE))
    );
  }
}

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

  @Value("${server.protocol}")
  private String protocol;

  @Value("${server.host}")
  private String host;

  @Value("${server.port}")
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
    String url = protocol.equals("http") && host.equals("localhost")
        ? protocol + "://" + host + ":" + port
        : protocol + "://" + host;

    Server server = new Server()
        .url(url)
        .description("API сервер");

    return new OpenAPI()
        .info(new io.swagger.v3.oas.models.info.Info()
            .title("Routie API")
            .description("REST API сервиса Routie. "
                + "Документация WebSocket-уведомлений (AsyncAPI): "
                + "[/asyncapi/index.html](/asyncapi/index.html)"))
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

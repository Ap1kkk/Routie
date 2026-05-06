package ru.ngtu.twosteps.common.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import java.util.Comparator;
import java.util.List;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Egor Bokov
 */
@Configuration
@SecurityScheme(
    name = "Bearer Authentication",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    scheme = "bearer"
)
public class OpenApiConfig {

  @Value("${springdoc.swagger-ui.schemes.dev}")
  private String devUrl;
  @Value("${springdoc.swagger-ui.schemes.prod}")
  private String prodUrl;

  @Bean
  public OpenAPI customOpenAPI() {
    return new OpenAPI()
        .addServersItem(new Server().url(devUrl).description("HTTP"))
        .addServersItem(new Server().url(prodUrl).description("HTTPS"))
        .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"));
  }

  @Bean
  public OpenApiCustomizer tagSorter() {
    return openApi -> {
      List<Tag> tags = openApi.getTags();
      List<String> orderList = List.of(
          "Auth",
          "User",
          "User routes",
          "Route",
          "Route admin",
          "Category",
          "Category admin",
          "Achievements",
          "Statistics",
          "Image cleaner"
      );
      if (tags != null) {
        tags.sort(Comparator.comparingInt(tag -> orderList.indexOf(tag.getName())));
        openApi.setTags(tags);
      }
    };
  }
}
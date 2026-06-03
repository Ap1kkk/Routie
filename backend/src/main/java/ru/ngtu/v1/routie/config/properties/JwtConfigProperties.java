package ru.ngtu.v1.routie.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "security.jwt")
@Data
public class JwtConfigProperties {
    private String header = "Authorization";
    private String secret;
    private Integer expiration = 900;           // 15 минут
    private Integer refreshExpiration = 2592000; // 30 дней
}

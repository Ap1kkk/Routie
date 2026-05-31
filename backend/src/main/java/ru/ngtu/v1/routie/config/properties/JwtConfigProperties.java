package ru.ngtu.v1.routie.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Egor Bokov
 */
@ConfigurationProperties(prefix = "security.jwt")
@Data
public class JwtConfigProperties {
    private String header = "Authorization";
    private String secret;
    private Integer expiration = 86400;
}

package ru.ngtu.twosteps.common.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Egor Bokov
 */
@ConfigurationProperties(prefix = "security.cors")
@Data
public class CorsConfigProperties {
    private String allowedOrigin;
    private String allowedHeader = "*";
    private String allowedMethod = "*";
    private String configurationPattern = "/**";
}
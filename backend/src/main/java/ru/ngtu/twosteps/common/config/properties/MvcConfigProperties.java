package ru.ngtu.twosteps.common.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Egor Bokov
 */
@ConfigurationProperties(prefix = "mvc")
@Data
public class MvcConfigProperties {
    private String dateFormat;
    private String resourcePathPattern;
    private String resourceLocation;
}

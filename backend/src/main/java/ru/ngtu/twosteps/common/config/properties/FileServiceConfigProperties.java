package ru.ngtu.twosteps.common.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Egor Bokov
 */
@ConfigurationProperties(prefix = "file-service")
@Data
public class FileServiceConfigProperties {
    private String baseUploadPath;
}

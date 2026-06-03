package ru.ngtu.v1.routie.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "spring.minio")
@Data
public class MinioConfigProperties {
    private String url;
    private String bucket;
    private String accessKey;
    private String secretKey;
}

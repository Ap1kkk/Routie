package ru.ngtu.twosteps.common.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "spring.minio")
@Component
@Data
public class MinioConfigProperties {
  private String url;
  private String accessKey;
  private String secretKey;
  private String bucket;
}

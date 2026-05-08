package ru.ngtu.twosteps.common.config;

import io.minio.MinioClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.ngtu.twosteps.common.config.properties.MinioConfigProperties;

@Configuration
public class MinioConfig {

  @Bean
  public MinioClient minioClient(MinioConfigProperties minioConfigProperties) {
    return MinioClient.builder()
        .endpoint(minioConfigProperties.getUrl())
        .credentials(minioConfigProperties.getAccessKey(), minioConfigProperties.getSecretKey())
        .build();
  }
}

package ru.ngtu.v1.routie.config;

import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.ngtu.v1.routie.config.properties.MinioConfigProperties;

@Configuration
@EnableConfigurationProperties(MinioConfigProperties.class)
@RequiredArgsConstructor
public class MinioConfig {

    private final MinioConfigProperties properties;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(properties.getUrl())
                .credentials(properties.getAccessKey(), properties.getSecretKey())
                .build();
    }
}

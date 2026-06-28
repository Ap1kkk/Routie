package ru.ngtu.v1.routie.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@ConfigurationProperties(prefix = "routie.test-tokens")
@Data
public class TestTokenProperties {

    /**
     * Список тестовых токенов.
     * Активен только при профиле {@code test}.
     */
    private List<TestTokenEntry> tokens = new ArrayList<>();

    @Data
    public static class TestTokenEntry {
        /** Сам токен — произвольная строка, передаётся как Bearer. */
        private String token;
        /** UUID пользователя из БД, от имени которого будет аутентификация. */
        private UUID userId;
    }
}

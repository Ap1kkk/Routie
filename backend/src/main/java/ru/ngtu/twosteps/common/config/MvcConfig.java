package ru.ngtu.twosteps.common.config;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import ru.ngtu.twosteps.common.config.properties.MvcConfigProperties;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * @author Egor Bokov
 */
@Configuration
@EnableConfigurationProperties(MvcConfigProperties.class)
@RequiredArgsConstructor
public class MvcConfig implements WebMvcConfigurer {

    private final MvcConfigProperties configProperties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(configProperties.getResourcePathPattern())
                .addResourceLocations("file:" + System.getProperty("user.dir") + configProperties.getResourceLocation());
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addFormatterForFieldType(LocalDate.class, new LocalDateFormatter());
    }

    private class LocalDateFormatter implements org.springframework.format.Formatter<LocalDate> {
        @Override
        @SneakyThrows
        public LocalDate parse(String text, Locale locale){
            return LocalDate.parse(text, DateTimeFormatter.ofPattern(configProperties.getDateFormat(), locale));
        }

        @Override
        public String print(LocalDate object, Locale locale) {
            return object.toString();
        }
    }
}
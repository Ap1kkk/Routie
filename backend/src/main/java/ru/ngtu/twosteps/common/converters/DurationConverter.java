package ru.ngtu.twosteps.common.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.Duration;

/**
 * @author Egor Bokov
 */
@Converter(autoApply = true)
public class DurationConverter implements AttributeConverter<Duration, String> {

    @Override
    public String convertToDatabaseColumn(Duration duration) {
        return (duration == null) ? null : duration.toString();
    }

    @Override
    public Duration convertToEntityAttribute(String dbData) {
        return (dbData == null || dbData.isEmpty()) ? null : Duration.parse(dbData);
    }
}
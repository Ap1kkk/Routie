package ru.ngtu.v1.routie.service.stub;

import net.datafaker.Faker;
import ru.ngtu.v1.routie.dto.audioguide.response.AudioGuideResponse;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.landmark.response.LandmarkResponse;
import ru.ngtu.v1.routie.dto.profile.Gender;
import ru.ngtu.v1.routie.dto.profile.UserProfileFullResponse;
import ru.ngtu.v1.routie.dto.profile.UserProfileShortResponse;
import ru.ngtu.v1.routie.dto.route.RouteType;
import ru.ngtu.v1.routie.dto.route.response.CheckpointFullResponse;
import ru.ngtu.v1.routie.dto.route.response.RouteFullResponse;
import ru.ngtu.v1.routie.dto.route.response.RouteShortResponse;
import ru.ngtu.v1.routie.dto.session.RouteSessionStatus;
import ru.ngtu.v1.routie.dto.session.response.CheckpointProgressResponse;
import ru.ngtu.v1.routie.dto.session.response.RouteSessionResponse;
import ru.ngtu.v1.routie.dto.tag.TagResponse;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.IntStream;

/**
 * Фабрика фейковых объектов для stub-реализаций сервисов.
 */
public class FakeDataFactory {

    private static final Faker faker = new Faker(Locale.of("ru"));

    private FakeDataFactory() {
    }

    // -------------------------------------------------------------------------
    // MediaFileResponse
    // -------------------------------------------------------------------------

    public static MediaFileResponse fakeMediaFile() {
        return new MediaFileResponse(
                UUID.randomUUID(),
                faker.file().fileName(),
                faker.options().option("image/jpeg", "image/png", "image/webp"),
                Instant.now().minusSeconds(faker.number().numberBetween(0, 86400)),
                faker.number().numberBetween(0, 10)
        );
    }

    public static List<MediaFileResponse> fakeMediaFiles(int count) {
        return IntStream.range(0, count)
                .mapToObj(i -> fakeMediaFile())
                .toList();
    }

    // -------------------------------------------------------------------------
    // TagResponse
    // -------------------------------------------------------------------------

    public static TagResponse fakeTag() {
        String[] tagNames = {
                "Парки", "Архитектура", "История", "Природа", "Спорт",
                "Культура", "Еда", "Музеи", "Фотография", "Пешком",
                "На велосипеде", "Семейный", "Активный отдых", "Городской"
        };
        return new TagResponse(UUID.randomUUID(), faker.options().option(tagNames));
    }

    public static List<TagResponse> fakeTags(int count) {
        return IntStream.range(0, count)
                .mapToObj(i -> fakeTag())
                .toList();
    }

    // -------------------------------------------------------------------------
    // AudioGuideResponse
    // -------------------------------------------------------------------------

    public static AudioGuideResponse fakeAudioGuide() {
        return new AudioGuideResponse(
                UUID.randomUUID(),
                "Аудиогид: " + faker.address().cityName(),
                faker.number().numberBetween(60, 1800),
                fakeMediaFile()
        );
    }

    // -------------------------------------------------------------------------
    // LandmarkResponse
    // -------------------------------------------------------------------------

    public static LandmarkResponse fakeLandmark() {
        return new LandmarkResponse(
                UUID.randomUUID(),
                faker.address().streetName(),
                faker.lorem().paragraph(2),
                fakeMediaFiles(faker.number().numberBetween(1, 4)),
                faker.bool().bool() ? fakeAudioGuide() : null
        );
    }

    public static List<LandmarkResponse> fakeLandmarks(int count) {
        return IntStream.range(0, count)
                .mapToObj(i -> fakeLandmark())
                .toList();
    }

    // -------------------------------------------------------------------------
    // CheckpointFullResponse
    // -------------------------------------------------------------------------

    public static CheckpointFullResponse fakeCheckpoint(int sortOrder) {
        // Координаты в районе Новосибирска
        double lat = 54.8 + faker.number().randomDouble(4, 0, 5) / 100.0;
        double lon = 83.0 + faker.number().randomDouble(4, 0, 5) / 100.0;
        return new CheckpointFullResponse(
                UUID.randomUUID(),
                lat,
                lon,
                sortOrder,
                fakeLandmark()
        );
    }

    public static List<CheckpointFullResponse> fakeCheckpoints(int count) {
        return IntStream.range(0, count)
                .mapToObj(FakeDataFactory::fakeCheckpoint)
                .toList();
    }

    // -------------------------------------------------------------------------
    // RouteShortResponse
    // -------------------------------------------------------------------------

    public static RouteShortResponse fakeRouteShort() {
        RouteType type = faker.options().option(RouteType.values());
        return new RouteShortResponse(
                UUID.randomUUID(),
                "Маршрут «" + faker.address().cityName() + "»",
                faker.lorem().paragraph(1),
                type.name(),
                faker.number().numberBetween(1, 6),
                faker.number().numberBetween(500, 15000),
                faker.number().numberBetween(15, 240),
                faker.address().cityName(),
                faker.number().numberBetween(0, 500),
                true,
                fakeMediaFiles(faker.number().numberBetween(1, 3)),
                fakeTags(faker.number().numberBetween(1, 4))
        );
    }

    public static List<RouteShortResponse> fakeRouteShortList(int count) {
        return IntStream.range(0, count)
                .mapToObj(i -> fakeRouteShort())
                .toList();
    }

    // -------------------------------------------------------------------------
    // RouteFullResponse
    // -------------------------------------------------------------------------

    public static RouteFullResponse fakeRouteFull() {
        RouteType type = faker.options().option(RouteType.values());
        int checkpointCount = faker.number().numberBetween(3, 8);
        return new RouteFullResponse(
                UUID.randomUUID(),
                "Маршрут «" + faker.address().cityName() + "»",
                faker.lorem().paragraph(2),
                type.name(),
                faker.number().numberBetween(1, 6),
                faker.number().numberBetween(500, 15000),
                faker.number().numberBetween(15, 240),
                faker.address().cityName(),
                faker.number().numberBetween(0, 500),
                true,
                fakeMediaFiles(faker.number().numberBetween(1, 3)),
                fakeCheckpoints(checkpointCount),
                fakeTags(faker.number().numberBetween(1, 4))
        );
    }

    // -------------------------------------------------------------------------
    // UserProfileFullResponse
    // -------------------------------------------------------------------------

    public static UserProfileFullResponse fakeUserProfileFull() {
        Gender gender = faker.options().option(Gender.values());
        return new UserProfileFullResponse(
                UUID.randomUUID(),
                faker.internet().emailAddress(),
                faker.name().fullName(),
                faker.internet().username(),
                fakeMediaFile(),
                LocalDate.now().minusYears(faker.number().numberBetween(18, 50)),
                gender,
                faker.address().cityName(),
                faker.options().option("Бег", "Велоспорт", "Пешие прогулки", "Скандинавская ходьба"),
                faker.options().option("Пешком", "Велосипед", "Самокат", "Общественный транспорт"),
                faker.number().numberBetween(0, 10000),
                faker.number().numberBetween(1, 50),
                faker.number().numberBetween(0, 500000),
                faker.number().numberBetween(0, 200),
                faker.number().numberBetween(0, 500),
                false,
                LocalDateTime.now().minusDays(faker.number().numberBetween(1, 365))
        );
    }

    // -------------------------------------------------------------------------
    // UserProfileShortResponse
    // -------------------------------------------------------------------------

    public static UserProfileShortResponse fakeUserProfileShort() {
        return new UserProfileShortResponse(
                UUID.randomUUID(),
                faker.name().firstName(),
                faker.name().lastName(),
                fakeMediaFile(),
                faker.number().numberBetween(1, 50),
                faker.number().numberBetween(0, 10000),
                faker.address().cityName(),
                faker.bool().bool()
        );
    }

    public static List<UserProfileShortResponse> fakeUserProfileShortList(int count) {
        return IntStream.range(0, count)
                .mapToObj(i -> fakeUserProfileShort())
                .toList();
    }

    // -------------------------------------------------------------------------
    // RouteSessionResponse
    // -------------------------------------------------------------------------

    public static RouteSessionResponse fakeRouteSession(UUID routeId, UUID userId, RouteSessionStatus status) {
        Instant startedAt = Instant.now().minusSeconds(faker.number().numberBetween(300, 7200));
        Instant finishedAt = status == RouteSessionStatus.ACTIVE ? null : Instant.now();
        long duration = finishedAt != null ? finishedAt.getEpochSecond() - startedAt.getEpochSecond() : 0;

        int checkpointCount = faker.number().numberBetween(2, 5);
        List<CheckpointProgressResponse> progress = IntStream.range(0, checkpointCount)
                .mapToObj(i -> new CheckpointProgressResponse(
                        UUID.randomUUID(),
                        startedAt.plusSeconds((long) i * (duration / checkpointCount + 1)),
                        faker.number().randomDouble(1, 3, 20)
                ))
                .toList();

        return new RouteSessionResponse(
                UUID.randomUUID(),
                routeId != null ? routeId : UUID.randomUUID(),
                userId != null ? userId : UUID.randomUUID(),
                status,
                startedAt,
                finishedAt,
                status == RouteSessionStatus.ACTIVE ? null : duration,
                status == RouteSessionStatus.ACTIVE ? null : faker.number().numberBetween(500, 15000),
                status == RouteSessionStatus.ACTIVE ? null : faker.number().randomDouble(1, 3, 20),
                progress
        );
    }

    // -------------------------------------------------------------------------
    // Вспомогательные методы
    // -------------------------------------------------------------------------

    public static <T> ru.ngtu.v1.routie.dto.common.PageResponse<T> fakePage(
            List<T> content, int page, int size, long totalElements) {
        int totalPages = (int) Math.ceil((double) totalElements / size);
        return new ru.ngtu.v1.routie.dto.common.PageResponse<>(content, totalElements, totalPages, page);
    }

    public static Faker getFaker() {
        return faker;
    }
}

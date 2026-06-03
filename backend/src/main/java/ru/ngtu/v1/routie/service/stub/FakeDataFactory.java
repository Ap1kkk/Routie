package ru.ngtu.v1.routie.service.stub;

import net.datafaker.Faker;
import ru.ngtu.v1.routie.dto.audioguide.response.AudioGuideResponse;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.gamification.AchievementResponse;
import ru.ngtu.v1.routie.dto.gamification.AchievementsListResponse;
import ru.ngtu.v1.routie.dto.gamification.AllAchievementsResponse;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardEntry;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardPeriod;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardResponse;
import ru.ngtu.v1.routie.dto.gamification.UserAchievementResponse;
import ru.ngtu.v1.routie.dto.gamification.XpTransactionResponse;
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
import ru.ngtu.v1.routie.dto.statistics.GamificationStatisticsResponse;
import ru.ngtu.v1.routie.dto.statistics.PopularRouteResponse;
import ru.ngtu.v1.routie.dto.statistics.PopularRoutesResponse;
import ru.ngtu.v1.routie.dto.statistics.StatisticsOverviewResponse;
import ru.ngtu.v1.routie.dto.statistics.UserActivityResponse;
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
                faker.name().fullName(),
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
    // Gamification — Leaderboard
    // -------------------------------------------------------------------------

    public static LeaderboardEntry fakeLeaderboardEntry(int rank) {
        return new LeaderboardEntry(
                rank,
                UUID.randomUUID(),
                faker.name().fullName(),
                faker.internet().username(),
                fakeMediaFile(),
                faker.number().numberBetween(1, 50),
                faker.number().numberBetween(100, 10000),
                faker.number().numberBetween(10, 2000)
        );
    }

    public static LeaderboardResponse fakeLeaderboard(LeaderboardPeriod period, int limit) {
        List<LeaderboardEntry> entries = IntStream.rangeClosed(1, limit)
                .mapToObj(FakeDataFactory::fakeLeaderboardEntry)
                .toList();
        return new LeaderboardResponse(period, entries);
    }

    // -------------------------------------------------------------------------
    // Gamification — Achievements
    // -------------------------------------------------------------------------

    private static final String[] ACHIEVEMENT_TITLES = {
            "Первый шаг", "Путешественник", "Марафонец", "Исследователь",
            "Коллекционер", "Спортсмен", "Знаток города", "Неутомимый"
    };

    public static UserAchievementResponse fakeUserAchievement() {
        boolean unlocked = faker.bool().bool();
        int target = faker.options().option(5, 10, 25, 50, 100);
        int progress = unlocked ? target : faker.number().numberBetween(0, target);
        return new UserAchievementResponse(
                UUID.randomUUID(),
                faker.options().option(ACHIEVEMENT_TITLES),
                faker.lorem().sentence(),
                fakeMediaFile(),
                faker.number().numberBetween(10, 500),
                progress,
                target,
                unlocked,
                unlocked ? Instant.now().minusSeconds(faker.number().numberBetween(3600, 2592000)) : null
        );
    }

    public static AchievementsListResponse fakeAchievementsList() {
        int total = 20;
        List<UserAchievementResponse> achievements = IntStream.range(0, total)
                .mapToObj(i -> fakeUserAchievement())
                .toList();
        int unlocked = (int) achievements.stream().filter(UserAchievementResponse::getIsUnlocked).count();
        return new AchievementsListResponse(achievements, unlocked, total);
    }

    public static AllAchievementsResponse fakeAllAchievements() {
        List<AchievementResponse> achievements = IntStream.range(0, 20)
                .mapToObj(i -> new AchievementResponse(
                        UUID.randomUUID(),
                        faker.options().option(ACHIEVEMENT_TITLES),
                        faker.lorem().sentence(),
                        fakeMediaFile(),
                        faker.number().numberBetween(10, 500),
                        faker.options().option(5, 10, 25, 50, 100)
                ))
                .toList();
        return new AllAchievementsResponse(achievements);
    }

    // -------------------------------------------------------------------------
    // Gamification — XP History
    // -------------------------------------------------------------------------

    private static final String[] XP_REASONS = {
            "ROUTE_COMPLETED", "CHECKPOINT_REACHED", "ACHIEVEMENT_UNLOCKED",
            "DAILY_LOGIN", "FRIEND_ADDED", "LANDMARK_VISITED"
    };

    public static XpTransactionResponse fakeXpTransaction() {
        String reason = faker.options().option(XP_REASONS);
        return new XpTransactionResponse(
                UUID.randomUUID(),
                faker.number().numberBetween(5, 200),
                reason,
                UUID.randomUUID(),
                reason.contains("ROUTE") ? "ROUTE" : reason.contains("ACHIEVEMENT") ? "ACHIEVEMENT" : "OTHER",
                Instant.now().minusSeconds(faker.number().numberBetween(0, 2592000))
        );
    }

    public static List<XpTransactionResponse> fakeXpTransactions(int count) {
        return IntStream.range(0, count)
                .mapToObj(i -> fakeXpTransaction())
                .toList();
    }

    // -------------------------------------------------------------------------
    // Общие вспомогательные методы
    // -------------------------------------------------------------------------

    public static <T> ru.ngtu.v1.routie.dto.common.PageResponse<T> fakePage(
            List<T> content, int page, int size, long totalElements) {
        int totalPages = (int) Math.ceil((double) totalElements / size);
        return new ru.ngtu.v1.routie.dto.common.PageResponse<>(content, totalElements, totalPages, page);
    }

    // -------------------------------------------------------------------------
    // Statistics
    // -------------------------------------------------------------------------

    public static StatisticsOverviewResponse fakeStatisticsOverview() {
        int totalUsers = faker.number().numberBetween(1000, 50000);
        return new StatisticsOverviewResponse(
                totalUsers,
                faker.number().numberBetween(100, totalUsers),
                faker.number().numberBetween(500, 100000),
                (long) faker.number().numberBetween(1_000_000, 500_000_000),
                (long) faker.number().numberBetween(50_000, 10_000_000),
                (float) (faker.number().randomDouble(1, 1, 30) + 1.0)
        );
    }

    public static UserActivityResponse fakeUserActivity() {
        return new UserActivityResponse(
                UUID.randomUUID(),
                faker.name().fullName(),
                faker.internet().username(),
                faker.number().numberBetween(1, 50),
                faker.number().numberBetween(0, 10000),
                faker.number().numberBetween(0, 200),
                faker.number().numberBetween(0, 500_000),
                Instant.now().minusSeconds(faker.number().numberBetween(0, 2_592_000))
        );
    }

    public static List<UserActivityResponse> fakeUserActivityList(int count) {
        return IntStream.range(0, count)
                .mapToObj(i -> fakeUserActivity())
                .toList();
    }

    public static PopularRoutesResponse fakePopularRoutes(int limit) {
        List<PopularRouteResponse> routes = IntStream.range(0, limit)
                .mapToObj(i -> new PopularRouteResponse(
                        UUID.randomUUID(),
                        "Маршрут «" + faker.address().cityName() + "»",
                        faker.options().option(RouteType.values()).name(),
                        faker.number().numberBetween(10, 5000),
                        faker.address().cityName()
                ))
                .toList();
        return new PopularRoutesResponse(routes);
    }

    public static GamificationStatisticsResponse fakeGamificationStatistics() {
        java.util.Map<Integer, Integer> usersByLevel = new java.util.LinkedHashMap<>();
        int[] levels = {1, 2, 3, 5, 10, 15, 20, 30, 50};
        for (int level : levels) {
            usersByLevel.put(level, faker.number().numberBetween(10, 2000));
        }
        return new GamificationStatisticsResponse(
                (long) faker.number().numberBetween(100_000, 50_000_000),
                (float) faker.number().randomDouble(1, 100, 5000),
                faker.options().option("Первый шаг", "Марафонец", "Исследователь", "Коллекционер"),
                usersByLevel,
                faker.options().option("WEEK", "MONTH", "SEASON")
        );
    }

    // -------------------------------------------------------------------------
    // Общие вспомогательные методы
    // -------------------------------------------------------------------------

    public static Faker getFaker() {
        return faker;
    }
}

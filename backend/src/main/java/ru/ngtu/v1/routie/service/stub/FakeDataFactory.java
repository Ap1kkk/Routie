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
import ru.ngtu.v1.routie.dto.statistics.*;
import ru.ngtu.v1.routie.dto.statistics.GamificationStatisticsResponse;
import ru.ngtu.v1.routie.dto.statistics.PopularRouteResponse;
import ru.ngtu.v1.routie.dto.statistics.PopularRoutesResponse;
import ru.ngtu.v1.routie.dto.statistics.StatisticsOverviewResponse;
import ru.ngtu.v1.routie.dto.statistics.UserActivityResponse;
import ru.ngtu.v1.routie.dto.tag.TagResponse;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.stream.IntStream;

/**
 * Фабрика фейковых объектов для stub-реализаций сервисов.
 */
public class FakeDataFactory {

    private static final Faker faker = new Faker(Locale.of("ru"));

    private static final String[] ACHIEVEMENT_TITLES = {
            "Первый шаг", "Путешественник", "Марафонец", "Исследователь",
            "Коллекционер", "Спортсмен", "Знаток города", "Неутомимый"
    };

    private static final String[] XP_REASONS = {
            "ROUTE_COMPLETED", "CHECKPOINT_REACHED", "ACHIEVEMENT_UNLOCKED",
            "DAILY_LOGIN", "FRIEND_ADDED", "LANDMARK_VISITED"
    };

    private FakeDataFactory() {
    }

    // -------------------------------------------------------------------------
    // MediaFileResponse
    // -------------------------------------------------------------------------

    public static MediaFileResponse fakeMediaFile() {
        return MediaFileResponse.builder()
                .id(UUID.randomUUID())
                .filename(faker.file().fileName())
                .contentType(faker.options().option("image/jpeg", "image/png", "image/webp"))
                .createTs(Instant.now().minusSeconds(faker.number().numberBetween(0, 86400)))
                .sortOrder(faker.number().numberBetween(0, 10))
                .build();
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
        return TagResponse.builder()
                .id(UUID.randomUUID())
                .title(faker.options().option(tagNames))
                .build();
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
        return AudioGuideResponse.builder()
                .id(UUID.randomUUID())
                .title("Аудиогид: " + faker.address().cityName())
                .durationSeconds(faker.number().numberBetween(60, 1800))
                .file(fakeMediaFile())
                .build();
    }

    // -------------------------------------------------------------------------
    // LandmarkResponse
    // -------------------------------------------------------------------------

    public static LandmarkResponse fakeLandmark() {
        return LandmarkResponse.builder()
                .id(UUID.randomUUID())
                .title(faker.address().streetName())
                .description(faker.lorem().paragraph(2))
                .images(fakeMediaFiles(faker.number().numberBetween(1, 4)))
                .audioGuide(faker.bool().bool() ? fakeAudioGuide() : null)
                .build();
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
        double lat = 54.8 + faker.number().randomDouble(4, 0, 5) / 100.0;
        double lon = 83.0 + faker.number().randomDouble(4, 0, 5) / 100.0;
        return CheckpointFullResponse.builder()
                .id(UUID.randomUUID())
                .latitude(lat)
                .longitude(lon)
                .sortOrder(sortOrder)
                .landmark(fakeLandmark())
                .build();
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
        return RouteShortResponse.builder()
                .id(UUID.randomUUID())
                .title("Маршрут «" + faker.address().cityName() + "»")
                .description(faker.lorem().paragraph(1))
                .type(type.name())
                .difficulty(faker.number().numberBetween(1, 6))
                .lengthMeters(faker.number().numberBetween(500, 15000))
                .estimatedTimeMinutes(faker.number().numberBetween(15, 240))
                .city(faker.address().cityName())
                .completionsCount(faker.number().numberBetween(0, 500))
                .isActive(true)
                .images(fakeMediaFiles(faker.number().numberBetween(1, 3)))
                .tags(fakeTags(faker.number().numberBetween(1, 4)))
                .build();
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
        return RouteFullResponse.builder()
                .id(UUID.randomUUID())
                .title("Маршрут «" + faker.address().cityName() + "»")
                .description(faker.lorem().paragraph(2))
                .type(type.name())
                .difficulty(faker.number().numberBetween(1, 6))
                .lengthMeters(faker.number().numberBetween(500, 15000))
                .estimatedTimeMinutes(faker.number().numberBetween(15, 240))
                .city(faker.address().cityName())
                .completionsCount(faker.number().numberBetween(0, 500))
                .isActive(true)
                .images(fakeMediaFiles(faker.number().numberBetween(1, 3)))
                .checkpoints(fakeCheckpoints(faker.number().numberBetween(3, 8)))
                .tags(fakeTags(faker.number().numberBetween(1, 4)))
                .build();
    }

    // -------------------------------------------------------------------------
    // UserProfileFullResponse
    // -------------------------------------------------------------------------

    public static UserProfileFullResponse fakeUserProfileFull() {
        Gender gender = faker.options().option(Gender.values());
        return UserProfileFullResponse.builder()
                .id(UUID.randomUUID())
                .email(faker.internet().emailAddress())
                .name(faker.name().fullName())
                .username(faker.internet().username())
                .avatar(fakeMediaFile())
                .dateOfBirth(LocalDate.now().minusYears(faker.number().numberBetween(18, 50)))
                .gender(gender)
                .height(faker.number().numberBetween(155, 200))
                .weight(faker.number().numberBetween(50, 120))
                .preferredTags(fakeTags(faker.number().numberBetween(1, 5)))
                .totalXp(faker.number().numberBetween(0, 10000))
                .currentLevel(faker.number().numberBetween(1, 50))
                .totalDistanceMeters(faker.number().numberBetween(0, 500000))
                .totalRoutesCompleted(faker.number().numberBetween(0, 200))
                .totalLandmarksVisited(faker.number().numberBetween(0, 500))
                .isFriend(false)
                .createdAt(LocalDateTime.now().minusDays(faker.number().numberBetween(1, 365)))
                .build();
    }

    // -------------------------------------------------------------------------
    // UserProfileShortResponse
    // -------------------------------------------------------------------------

    public static UserProfileShortResponse fakeUserProfileShort() {
        return UserProfileShortResponse.builder()
                .id(UUID.randomUUID())
                .name(faker.name().fullName())
                .username(faker.internet().username())
                .avatar(fakeMediaFile())
                .currentLevel(faker.number().numberBetween(1, 50))
                .totalXp(faker.number().numberBetween(0, 10000))
                .isFriend(faker.bool().bool())
                .build();
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
                .mapToObj(i -> CheckpointProgressResponse.builder()
                        .checkpointId(UUID.randomUUID())
                        .reachedAt(startedAt.plusSeconds((long) i * (duration / checkpointCount + 1)))
                        .avgSpeedKmh(faker.number().randomDouble(1, 3, 20))
                        .build())
                .toList();

        return RouteSessionResponse.builder()
                .id(UUID.randomUUID())
                .routeId(routeId != null ? routeId : UUID.randomUUID())
                .userId(userId != null ? userId : UUID.randomUUID())
                .status(status)
                .startedAt(startedAt)
                .finishedAt(finishedAt)
                .totalDurationSeconds(status == RouteSessionStatus.ACTIVE ? null : duration)
                .totalDistanceMeters(status == RouteSessionStatus.ACTIVE ? null : faker.number().numberBetween(500, 15000))
                .avgSpeedKmh(status == RouteSessionStatus.ACTIVE ? null : faker.number().randomDouble(1, 3, 20))
                .checkpoints(progress)
                .build();
    }

    // -------------------------------------------------------------------------
    // Gamification — Leaderboard
    // -------------------------------------------------------------------------

    public static LeaderboardEntry fakeLeaderboardEntry(int rank) {
        return LeaderboardEntry.builder()
                .rank(rank)
                .userId(UUID.randomUUID())
                .name(faker.name().fullName())
                .username(faker.internet().username())
                .avatar(fakeMediaFile())
                .currentLevel(faker.number().numberBetween(1, 50))
                .totalXp(faker.number().numberBetween(100, 10000))
                .periodXp(faker.number().numberBetween(10, 2000))
                .build();
    }

    public static LeaderboardResponse fakeLeaderboard(LeaderboardPeriod period, int limit) {
        return LeaderboardResponse.builder()
                .period(period)
                .entries(IntStream.rangeClosed(1, limit)
                        .mapToObj(FakeDataFactory::fakeLeaderboardEntry)
                        .toList())
                .build();
    }

    // -------------------------------------------------------------------------
    // Gamification — Achievements
    // -------------------------------------------------------------------------

    public static UserAchievementResponse fakeUserAchievement() {
        boolean unlocked = faker.bool().bool();
        int target = faker.options().option(5, 10, 25, 50, 100);
        int progress = unlocked ? target : faker.number().numberBetween(0, target);
        return UserAchievementResponse.builder()
                .achievementId(UUID.randomUUID())
                .title(faker.options().option(ACHIEVEMENT_TITLES))
                .description(faker.lorem().sentence())
                .icon(fakeMediaFile())
                .xpReward(faker.number().numberBetween(10, 500))
                .progress(progress)
                .targetValue(target)
                .isUnlocked(unlocked)
                .unlockedAt(unlocked ? Instant.now().minusSeconds(faker.number().numberBetween(3600, 2592000)) : null)
                .build();
    }

    public static AchievementsListResponse fakeAchievementsList() {
        int total = 20;
        List<UserAchievementResponse> achievements = IntStream.range(0, total)
                .mapToObj(i -> fakeUserAchievement())
                .toList();
        int unlocked = (int) achievements.stream().filter(UserAchievementResponse::getIsUnlocked).count();
        return AchievementsListResponse.builder()
                .achievements(achievements)
                .totalUnlocked(unlocked)
                .totalAchievements(total)
                .build();
    }

    public static AllAchievementsResponse fakeAllAchievements() {
        List<AchievementResponse> achievements = IntStream.range(0, 20)
                .mapToObj(i -> AchievementResponse.builder()
                        .id(UUID.randomUUID())
                        .title(faker.options().option(ACHIEVEMENT_TITLES))
                        .description(faker.lorem().sentence())
                        .icon(fakeMediaFile())
                        .xpReward(faker.number().numberBetween(10, 500))
                        .targetValue(faker.options().option(5, 10, 25, 50, 100))
                        .build())
                .toList();
        return AllAchievementsResponse.builder()
                .achievements(achievements)
                .build();
    }

    // -------------------------------------------------------------------------
    // Gamification — XP History
    // -------------------------------------------------------------------------

    public static XpTransactionResponse fakeXpTransaction() {
        String reason = faker.options().option(XP_REASONS);
        return XpTransactionResponse.builder()
                .id(UUID.randomUUID())
                .amount(faker.number().numberBetween(5, 200))
                .reason(reason)
                .referenceId(UUID.randomUUID())
                .referenceType(reason.contains("ROUTE") ? "ROUTE" : reason.contains("ACHIEVEMENT") ? "ACHIEVEMENT" : "OTHER")
                .createdAt(Instant.now().minusSeconds(faker.number().numberBetween(0, 2592000)))
                .build();
    }

    public static List<XpTransactionResponse> fakeXpTransactions(int count) {
        return IntStream.range(0, count)
                .mapToObj(i -> fakeXpTransaction())
                .toList();
    }

    // -------------------------------------------------------------------------
    // Statistics
    // -------------------------------------------------------------------------

    public static StatisticsOverviewResponse fakeStatisticsOverview() {
        int totalUsers = faker.number().numberBetween(1000, 50000);
        return StatisticsOverviewResponse.builder()
                .totalUsers(totalUsers)
                .activeUsersLast30Days(faker.number().numberBetween(100, totalUsers))
                .totalRoutesCompleted(faker.number().numberBetween(500, 100000))
                .totalDistanceMeters((long) faker.number().numberBetween(1_000_000, 500_000_000))
                .totalXpEarned((long) faker.number().numberBetween(50_000, 10_000_000))
                .averageLevel((float) (faker.number().randomDouble(1, 1, 30) + 1.0))
                .build();
    }

    public static UserActivityResponse fakeUserActivity() {
        return UserActivityResponse.builder()
                .userId(UUID.randomUUID())
                .name(faker.name().fullName())
                .username(faker.internet().username())
                .currentLevel(faker.number().numberBetween(1, 50))
                .totalXp(faker.number().numberBetween(0, 10000))
                .routesCompleted(faker.number().numberBetween(0, 200))
                .totalDistanceMeters(faker.number().numberBetween(0, 500_000))
                .lastActivityDate(Instant.now().minusSeconds(faker.number().numberBetween(0, 2_592_000)))
                .build();
    }

    public static List<UserActivityResponse> fakeUserActivityList(int count) {
        return IntStream.range(0, count)
                .mapToObj(i -> fakeUserActivity())
                .toList();
    }

    public static PopularRoutesResponse fakePopularRoutes(int limit) {
        List<PopularRouteResponse> routes = IntStream.range(0, limit)
                .mapToObj(i -> PopularRouteResponse.builder()
                        .routeId(UUID.randomUUID())
                        .title("Маршрут «" + faker.address().cityName() + "»")
                        .type(faker.options().option(RouteType.values()).name())
                        .completionsCount(faker.number().numberBetween(10, 5000))
                        .city(faker.address().cityName())
                        .build())
                .toList();
        return PopularRoutesResponse.builder()
                .routes(routes)
                .build();
    }

    public static GamificationStatisticsResponse fakeGamificationStatistics() {
        Map<Integer, Integer> usersByLevel = new LinkedHashMap<>();
        int[] levels = {1, 2, 3, 5, 10, 15, 20, 30, 50};
        for (int level : levels) {
            usersByLevel.put(level, faker.number().numberBetween(10, 2000));
        }
        return GamificationStatisticsResponse.builder()
                .totalXpDistributed((long) faker.number().numberBetween(100_000, 50_000_000))
                .averageXpPerUser((float) faker.number().randomDouble(1, 100, 5000))
                .topAchievement(faker.options().option("Первый шаг", "Марафонец", "Исследователь", "Коллекционер"))
                .usersByLevel(usersByLevel)
                .mostPopularPeriod(faker.options().option("WEEK", "MONTH", "SEASON"))
                .build();
    }

    public static SessionAdminResponse fakeSessionAdmin() {
        RouteSessionStatus status = faker.options().option(RouteSessionStatus.values());
        Instant startedAt = Instant.now().minusSeconds(faker.number().numberBetween(60, 86_400));
        Instant finishedAt = status != RouteSessionStatus.ACTIVE
                ? startedAt.plusSeconds(faker.number().numberBetween(300, 7_200))
                : null;
        Long duration = finishedAt != null ? finishedAt.getEpochSecond() - startedAt.getEpochSecond() : null;

        return SessionAdminResponse.builder()
                .id(UUID.randomUUID())
                .userId(UUID.randomUUID())
                .username(faker.internet().username())
                .userDisplayName(faker.name().fullName())
                .routeId(UUID.randomUUID())
                .routeTitle("Маршрут «" + faker.address().cityName() + "»")
                .status(status)
                .startedAt(startedAt)
                .finishedAt(finishedAt)
                .totalDurationSeconds(duration)
                .totalDistanceMeters(status != RouteSessionStatus.ACTIVE
                        ? faker.number().numberBetween(500, 20_000) : null)
                .avgSpeedKmh(status != RouteSessionStatus.ACTIVE
                        ? faker.number().randomDouble(1, 3, 25) : null)
                .build();
    }

    public static List<SessionAdminResponse> fakeSessionAdminList(int count) {
        return IntStream.range(0, count)
                .mapToObj(i -> fakeSessionAdmin())
                .toList();
    }

    public static SessionSummaryResponse fakeSessionSummary() {
        long finished = faker.number().numberBetween(50, 5_000);
        long aborted  = faker.number().numberBetween(10, 1_000);
        long active   = faker.number().numberBetween(0, 50);
        long total    = finished + aborted + active;
        long concluded = finished + aborted;

        return SessionSummaryResponse.builder()
                .totalSessions(total)
                .finishedCount(finished)
                .abortedCount(aborted)
                .activeCount(active)
                .completionRate(concluded > 0 ? (double) finished / concluded * 100.0 : null)
                .avgDurationSeconds(faker.number().randomDouble(0, 600, 5_400))
                .avgSpeedKmh(faker.number().randomDouble(1, 4, 20))
                .avgDistanceMeters(faker.number().randomDouble(0, 1_000, 15_000))
                .build();
    }

    // -------------------------------------------------------------------------
    // Общие вспомогательные методы
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

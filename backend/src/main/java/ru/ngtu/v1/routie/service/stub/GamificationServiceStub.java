package ru.ngtu.v1.routie.service.stub;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.gamification.AchievementResponse;
import ru.ngtu.v1.routie.dto.gamification.AchievementsListResponse;
import ru.ngtu.v1.routie.dto.gamification.AllAchievementsResponse;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardPeriod;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardResponse;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardSortField;
import ru.ngtu.v1.routie.dto.gamification.XpTransactionResponse;
import ru.ngtu.v1.routie.service.GamificationService;

import java.util.List;

@Slf4j
@Service
@Profile("stub")
@Primary
public class GamificationServiceStub implements GamificationService {

    @Override
    public LeaderboardResponse getLeaderboard(LeaderboardPeriod period, int limit, LeaderboardSortField sort) {
        log.debug("[STUB] getLeaderboard period={}, limit={}, sort={}", period, limit, sort);
        return FakeDataFactory.fakeLeaderboard(period, limit);
    }

    @Override
    public LeaderboardResponse getFriendsLeaderboard(LeaderboardPeriod period, int limit, LeaderboardSortField sort) {
        log.debug("[STUB] getFriendsLeaderboard period={}, limit={}, sort={}", period, limit, sort);
        return FakeDataFactory.fakeLeaderboard(period, limit);
    }

    @Override
    public AchievementsListResponse getUserAchievements() {
        log.debug("[STUB] getUserAchievements");
        return FakeDataFactory.fakeAchievementsList();
    }

    @Override
    public AllAchievementsResponse getAllAchievements() {
        log.debug("[STUB] getAllAchievements");
        return FakeDataFactory.fakeAllAchievements();
    }

    @Override
    public AchievementResponse updateAchievementIcon(java.util.UUID achievementId, MultipartFile file) {
        log.debug("[STUB] updateAchievementIcon: {}", achievementId);
        return AchievementResponse.builder()
                .id(achievementId)
                .title("Stub achievement")
                .description("Stub description")
                .xpReward(100)
                .targetValue(1)
                .build();
    }

    @Override
    public PageResponse<XpTransactionResponse> getXpHistory(int page, int size, String sort) {
        log.debug("[STUB] getXpHistory page={}, size={}", page, size);
        long total = 85L;
        List<XpTransactionResponse> content = FakeDataFactory.fakeXpTransactions(size);
        return FakeDataFactory.fakePage(content, page, size, total);
    }
}

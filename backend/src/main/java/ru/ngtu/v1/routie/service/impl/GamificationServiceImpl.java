package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.gamification.AchievementsListResponse;
import ru.ngtu.v1.routie.dto.gamification.AllAchievementsResponse;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardPeriod;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardResponse;
import ru.ngtu.v1.routie.dto.gamification.XpTransactionResponse;
import ru.ngtu.v1.routie.service.GamificationService;

@Service
@RequiredArgsConstructor
public class GamificationServiceImpl implements GamificationService {

    @Override
    public LeaderboardResponse getLeaderboard(LeaderboardPeriod period, int limit) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public LeaderboardResponse getFriendsLeaderboard(LeaderboardPeriod period, int limit) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public AchievementsListResponse getUserAchievements() {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public AllAchievementsResponse getAllAchievements() {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public PageResponse<XpTransactionResponse> getXpHistory(int page, int size, String sort) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

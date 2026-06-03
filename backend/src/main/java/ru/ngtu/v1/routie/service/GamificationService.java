package ru.ngtu.v1.routie.service;

import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.gamification.AchievementsListResponse;
import ru.ngtu.v1.routie.dto.gamification.AllAchievementsResponse;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardPeriod;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardResponse;
import ru.ngtu.v1.routie.dto.gamification.XpTransactionResponse;

public interface GamificationService {

    /**
     * Глобальный лидерборд за указанный период.
     *
     * @param period временной период (WEEK, MONTH, SEASON)
     * @param limit  максимальное число записей (не более 100)
     */
    LeaderboardResponse getLeaderboard(LeaderboardPeriod period, int limit);

    /**
     * Лидерборд среди друзей текущего пользователя за указанный период.
     *
     * @param period временной период (WEEK, MONTH, SEASON)
     * @param limit  максимальное число записей
     */
    LeaderboardResponse getFriendsLeaderboard(LeaderboardPeriod period, int limit);

    /**
     * Достижения текущего пользователя с прогрессом выполнения.
     */
    AchievementsListResponse getUserAchievements();

    /**
     * Полный список достижений системы, включая неразблокированные.
     */
    AllAchievementsResponse getAllAchievements();

    /**
     * История начислений XP текущего пользователя с пагинацией.
     */
    PageResponse<XpTransactionResponse> getXpHistory(int page, int size, String sort);
}

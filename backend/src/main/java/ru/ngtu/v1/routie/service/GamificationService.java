package ru.ngtu.v1.routie.service;

import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.gamification.AchievementResponse;
import ru.ngtu.v1.routie.dto.gamification.AchievementsListResponse;
import ru.ngtu.v1.routie.dto.gamification.AllAchievementsResponse;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardPeriod;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardResponse;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardSortField;
import ru.ngtu.v1.routie.dto.gamification.XpTransactionResponse;

import java.util.UUID;

public interface GamificationService {

    /**
     * Глобальный лидерборд за указанный период.
     *
     * @param period временной период (WEEK, MONTH, SEASON)
     * @param limit  максимальное число записей (не более 100)
     * @param sort   поле сортировки (по умолчанию TOTAL_XP)
     */
    LeaderboardResponse getLeaderboard(LeaderboardPeriod period, int limit, LeaderboardSortField sort);

    /**
     * Лидерборд среди друзей текущего пользователя (включая самого пользователя) за указанный период.
     *
     * @param period временной период (WEEK, MONTH, SEASON)
     * @param limit  максимальное число записей
     * @param sort   поле сортировки (по умолчанию TOTAL_XP)
     */
    LeaderboardResponse getFriendsLeaderboard(LeaderboardPeriod period, int limit, LeaderboardSortField sort);

    /**
     * Достижения текущего пользователя с прогрессом выполнения.
     */
    AchievementsListResponse getUserAchievements();

    /**
     * Полный список достижений системы, включая неразблокированные.
     */
    AllAchievementsResponse getAllAchievements();

    /**
     * Заменяет иконку достижения (только ADMIN). Старый файл удаляется, если был.
     */
    AchievementResponse updateAchievementIcon(UUID achievementId, MultipartFile file);

    /**
     * История начислений XP текущего пользователя с пагинацией.
     */
    PageResponse<XpTransactionResponse> getXpHistory(int page, int size, String sort);
}

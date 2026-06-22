package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.gamification.AchievementsListResponse;
import ru.ngtu.v1.routie.dto.gamification.AllAchievementsResponse;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardPeriod;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardResponse;
import ru.ngtu.v1.routie.dto.gamification.LeaderboardSortField;
import ru.ngtu.v1.routie.dto.gamification.XpTransactionResponse;
import ru.ngtu.v1.routie.service.GamificationService;

@RestController
@RequestMapping("/api/v1/gamification")
@RequiredArgsConstructor
@Validated
@Tag(name = "Gamification", description = "Геймификация: лидерборды, достижения, история XP")
@SecurityRequirement(name = "bearerAuth")
public class GamificationControllerV1 {

    private final GamificationService gamificationService;

    // -------------------------------------------------------------------------
    // Leaderboard
    // -------------------------------------------------------------------------

    @GetMapping("/leaderboard")
    @Operation(summary = "Глобальный лидерборд")
    public ApiResponse<LeaderboardResponse> getLeaderboard(
            @RequestParam LeaderboardPeriod period,
            @RequestParam(defaultValue = "100") @Max(100) int limit,
            @RequestParam(defaultValue = "TOTAL_XP") LeaderboardSortField sort
    ) {
        return ApiResponse.of(gamificationService.getLeaderboard(period, limit, sort));
    }

    @GetMapping("/leaderboard/friends")
    @Operation(summary = "Лидерборд среди друзей (включая самого пользователя)")
    public ApiResponse<LeaderboardResponse> getFriendsLeaderboard(
            @RequestParam LeaderboardPeriod period,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "TOTAL_XP") LeaderboardSortField sort
    ) {
        return ApiResponse.of(gamificationService.getFriendsLeaderboard(period, limit, sort));
    }

    // -------------------------------------------------------------------------
    // Achievements
    // -------------------------------------------------------------------------

    @GetMapping("/achievements")
    @Operation(summary = "Достижения текущего пользователя с прогрессом")
    public ApiResponse<AchievementsListResponse> getUserAchievements() {
        return ApiResponse.of(gamificationService.getUserAchievements());
    }

    @GetMapping("/achievements/all")
    @Operation(summary = "Все достижения системы, включая неразблокированные")
    public ApiResponse<AllAchievementsResponse> getAllAchievements() {
        return ApiResponse.of(gamificationService.getAllAchievements());
    }

    // -------------------------------------------------------------------------
    // XP History
    // -------------------------------------------------------------------------

    @GetMapping("/xp-history")
    @Operation(summary = "История начислений XP")
    public ApiResponse<PageResponse<XpTransactionResponse>> getXpHistory(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            @RequestParam(required = false) String sort
    ) {
        return ApiResponse.of(gamificationService.getXpHistory(page, size, sort));
    }
}

package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.gamification.*;
import ru.ngtu.v1.routie.model.User;
import ru.ngtu.v1.routie.model.UserProfile;
import ru.ngtu.v1.routie.model.XpTransaction;
import ru.ngtu.v1.routie.repository.FriendshipRepository;
import ru.ngtu.v1.routie.repository.MediaFileRepository;
import ru.ngtu.v1.routie.repository.UserProfileRepository;
import ru.ngtu.v1.routie.repository.UserRepository;
import ru.ngtu.v1.routie.repository.XpTransactionRepository;
import ru.ngtu.v1.routie.repository.projection.UserXpSum;
import ru.ngtu.v1.routie.security.CustomUserDetails;
import ru.ngtu.v1.routie.service.GamificationService;
import ru.ngtu.v1.routie.service.XpService;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GamificationServiceImpl implements GamificationService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final FriendshipRepository friendshipRepository;
    private final MediaFileRepository mediaFileRepository;
    private final XpTransactionRepository xpTransactionRepository;
    private final XpService xpService;

    // ==================== Leaderboard ====================

    @Override
    @Transactional(readOnly = true)
    public LeaderboardResponse getLeaderboard(LeaderboardPeriod period, int limit, LeaderboardSortField sort) {
        LeaderboardSortField effectiveSort = sort != null ? sort : LeaderboardSortField.TOTAL_XP;
        Instant since = periodStart(period);

        List<UUID> orderedUserIds;
        Map<UUID, Long> periodXpByUser;

        if (effectiveSort == LeaderboardSortField.TOTAL_XP) {
            List<UserXpSum> top = xpTransactionRepository.findTopByPeriodSince(since, PageRequest.of(0, limit));
            orderedUserIds = top.stream().map(UserXpSum::getUserId).toList();
            periodXpByUser = top.stream()
                    .collect(Collectors.toMap(UserXpSum::getUserId, UserXpSum::getTotal));
        } else {
            PageRequest pageable = PageRequest.of(0, limit, Sort.by(profileSortField(effectiveSort)).descending());
            Page<UserProfile> page = userProfileRepository.findAll(pageable);
            orderedUserIds = page.getContent().stream().map(UserProfile::getUserId).toList();
            periodXpByUser = xpService.getPeriodXpBulk(orderedUserIds, since);
        }

        return buildLeaderboardResponse(period, orderedUserIds, periodXpByUser);
    }

    @Override
    @Transactional(readOnly = true)
    public LeaderboardResponse getFriendsLeaderboard(LeaderboardPeriod period, int limit, LeaderboardSortField sort) {
        LeaderboardSortField effectiveSort = sort != null ? sort : LeaderboardSortField.TOTAL_XP;
        UUID currentUserId = getCurrentUserId();
        Instant since = periodStart(period);

        List<UUID> candidateIds = new ArrayList<>(friendshipRepository.findAcceptedFriendIds(currentUserId));
        candidateIds.add(currentUserId);

        List<UUID> orderedUserIds;
        Map<UUID, Long> periodXpByUser;

        if (effectiveSort == LeaderboardSortField.TOTAL_XP) {
            periodXpByUser = xpService.getPeriodXpBulk(candidateIds, since);
            orderedUserIds = candidateIds.stream()
                    .sorted(Comparator.comparingLong(
                            (UUID id) -> periodXpByUser.getOrDefault(id, 0L)).reversed())
                    .limit(limit)
                    .toList();
        } else {
            Map<UUID, UserProfile> profilesById = userProfileRepository.findAllById(candidateIds).stream()
                    .collect(Collectors.toMap(UserProfile::getUserId, Function.identity()));

            Comparator<UUID> byProfileField = Comparator.comparingInt(
                    (UUID id) -> extractProfileSortValue(profilesById.get(id), effectiveSort));

            orderedUserIds = candidateIds.stream()
                    .sorted(byProfileField.reversed())
                    .limit(limit)
                    .toList();
            periodXpByUser = xpService.getPeriodXpBulk(orderedUserIds, since);
        }

        return buildLeaderboardResponse(period, orderedUserIds, periodXpByUser);
    }

    // ==================== Achievements (пока не реализовано) ====================

    @Override
    public AchievementsListResponse getUserAchievements() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public AllAchievementsResponse getAllAchievements() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // ==================== XP History ====================

    @Override
    @Transactional(readOnly = true)
    public PageResponse<XpTransactionResponse> getXpHistory(int page, int size, String sort) {
        UUID userId = getCurrentUserId();
        PageRequest pageable = PageRequest.of(page, size);

        Page<XpTransaction> txPage = xpTransactionRepository.findAllByUserIdOrderByCreatedAtDesc(userId, pageable);

        List<XpTransactionResponse> content = txPage.getContent().stream()
                .map(t -> XpTransactionResponse.builder()
                        .id(t.getId())
                        .amount(t.getAmount())
                        .reason(t.getReason())
                        .referenceId(t.getReferenceId())
                        .referenceType(mapReferenceType(t.getReason()))
                        .createdAt(t.getCreatedAt())
                        .build())
                .toList();

        return new PageResponse<>(content, txPage.getTotalElements(), txPage.getTotalPages(), page);
    }

    // ==================== Вспомогательные методы ====================

    /**
     * Начало периода для лидербордов. Скользящее окно (без привязки к датам календаря),
     * т.к. ручки лидербордов принимают только {@code period}, без startDate/endDate.
     */
    private Instant periodStart(LeaderboardPeriod period) {
        Instant now = Instant.now();
        return switch (period) {
            case WEEK -> now.minus(7, ChronoUnit.DAYS);
            case MONTH -> now.minus(30, ChronoUnit.DAYS);
            case SEASON -> now.minus(90, ChronoUnit.DAYS);
        };
    }

    private String profileSortField(LeaderboardSortField sort) {
        return switch (sort) {
            case TOTAL_DISTANCE_METERS -> "totalDistanceMeters";
            case TOTAL_ROUTES_COMPLETED -> "totalRoutesCompleted";
            case TOTAL_XP -> "totalXp";
        };
    }

    private int extractProfileSortValue(UserProfile profile, LeaderboardSortField sort) {
        if (profile == null) {
            return 0;
        }
        return switch (sort) {
            case TOTAL_DISTANCE_METERS -> profile.getTotalDistanceMeters();
            case TOTAL_ROUTES_COMPLETED -> profile.getTotalRoutesCompleted();
            case TOTAL_XP -> profile.getTotalXp();
        };
    }

    private LeaderboardResponse buildLeaderboardResponse(
            LeaderboardPeriod period, List<UUID> orderedUserIds, Map<UUID, Long> periodXpByUser) {

        Map<UUID, User> usersById = userRepository.findAllById(orderedUserIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));
        Map<UUID, UserProfile> profilesById = userProfileRepository.findAllById(orderedUserIds).stream()
                .collect(Collectors.toMap(UserProfile::getUserId, Function.identity()));

        List<LeaderboardEntry> entries = new ArrayList<>();
        int rank = 1;
        for (UUID userId : orderedUserIds) {
            User user = usersById.get(userId);
            UserProfile profile = profilesById.get(userId);
            if (user == null || profile == null) {
                continue;
            }

            entries.add(LeaderboardEntry.builder()
                    .rank(rank++)
                    .userId(userId)
                    .name(profile.getName())
                    .username(user.getUsername())
                    .avatar(buildAvatarResponse(profile.getAvatarFileId()))
                    .currentLevel(profile.getCurrentLevel())
                    .totalXp(profile.getTotalXp())
                    .periodXp(periodXpByUser.getOrDefault(userId, 0L).intValue())
                    .build());
        }

        return LeaderboardResponse.builder()
                .period(period)
                .entries(entries)
                .build();
    }

    private MediaFileResponse buildAvatarResponse(UUID avatarFileId) {
        if (avatarFileId == null) {
            return null;
        }
        return mediaFileRepository.findById(avatarFileId)
                .map(f -> MediaFileResponse.builder()
                        .id(f.getId())
                        .filename(f.getOriginalFilename())
                        .contentType(f.getContentType())
                        .createTs(f.getCreatedAt())
                        .sortOrder(f.getSortOrder())
                        .build())
                .orElse(null);
    }

    private String mapReferenceType(String reason) {
        return "ROUTE_COMPLETED".equals(reason) ? "RouteSession" : null;
    }

    private UUID getCurrentUserId() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        return userDetails.getId();
    }
}

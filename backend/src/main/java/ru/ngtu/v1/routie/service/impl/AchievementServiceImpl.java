package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.gamification.AchievementResponse;
import ru.ngtu.v1.routie.dto.gamification.AchievementsListResponse;
import ru.ngtu.v1.routie.dto.gamification.AllAchievementsResponse;
import ru.ngtu.v1.routie.dto.gamification.UserAchievementResponse;
import ru.ngtu.v1.routie.exception.EntityNotFoundException;
import ru.ngtu.v1.routie.model.*;
import ru.ngtu.v1.routie.repository.AchievementRepository;
import ru.ngtu.v1.routie.repository.MediaFileRepository;
import ru.ngtu.v1.routie.repository.UserAchievementRepository;
import ru.ngtu.v1.routie.repository.UserProfileRepository;
import ru.ngtu.v1.routie.security.CustomUserDetails;
import ru.ngtu.v1.routie.service.AchievementService;
import ru.ngtu.v1.routie.service.FileService;
import ru.ngtu.v1.routie.service.NotificationService;
import ru.ngtu.v1.routie.service.XpService;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AchievementServiceImpl implements AchievementService {

    private static final String XP_REASON_ACHIEVEMENT_UNLOCKED = "ACHIEVEMENT_UNLOCKED";

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final UserProfileRepository userProfileRepository;
    private final MediaFileRepository mediaFileRepository;
    private final FileService fileService;
    private final XpService xpService;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public AchievementsListResponse getUserAchievements() {
        UUID userId = getCurrentUserId();
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Профиль", userId));

        List<Achievement> achievements = achievementRepository.findAll();

        Map<UUID, java.time.Instant> unlockedAtById = userAchievementRepository.findAllById_UserId(userId).stream()
                .collect(Collectors.toMap(ua -> ua.getId().getAchievementId(), UserAchievement::getUnlockedAt));

        List<UserAchievementResponse> entries = achievements.stream()
                .map(achievement -> {
                    int progress = Math.min(metricValue(profile, achievement.getMetric()), achievement.getTargetValue());
                    java.time.Instant unlockedAt = unlockedAtById.get(achievement.getId());

                    return UserAchievementResponse.builder()
                            .achievementId(achievement.getId())
                            .title(achievement.getTitle())
                            .description(achievement.getDescription())
                            .icon(buildIconResponse(achievement.getIconFileId()))
                            .xpReward(achievement.getXpReward())
                            .progress(progress)
                            .targetValue(achievement.getTargetValue())
                            .isUnlocked(unlockedAt != null)
                            .unlockedAt(unlockedAt)
                            .build();
                })
                .toList();

        return AchievementsListResponse.builder()
                .achievements(entries)
                .totalUnlocked((int) entries.stream().filter(UserAchievementResponse::getIsUnlocked).count())
                .totalAchievements(entries.size())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AllAchievementsResponse getAllAchievements() {
        List<AchievementResponse> responses = achievementRepository.findAll().stream()
                .map(this::toAchievementResponse)
                .toList();
        return AllAchievementsResponse.builder().achievements(responses).build();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public AchievementResponse updateIcon(UUID achievementId, MultipartFile file) {
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new EntityNotFoundException("Достижение", achievementId));

        if (achievement.getIconFileId() != null) {
            try {
                fileService.delete(achievement.getIconFileId());
            } catch (Exception e) {
                log.warn("Не удалось удалить старую иконку {} достижения {}: {}",
                        achievement.getIconFileId(), achievementId, e.getMessage());
            }
        }

        MediaFileResponse uploaded = fileService.upload(file, 0);
        achievement.setIconFileId(uploaded.getId());
        achievementRepository.save(achievement);

        log.info("Обновлена иконка достижения: id={}", achievementId);
        return toAchievementResponse(achievement);
    }

    @Override
    @Transactional
    public void evaluateForUser(UUID userId) {
        UserProfile profile = userProfileRepository.findById(userId).orElse(null);
        if (profile == null) {
            return;
        }

        List<Achievement> achievements = achievementRepository.findAll();
        Set<UUID> unlockedIds = userAchievementRepository.findUnlockedAchievementIds(userId);

        // Цикл повторяется, т.к. начисление XP за достижение может само поднять уровень
        // и тем самым разблокировать ещё одно (level-based) достижение в этом же вызове.
        boolean changed = true;
        while (changed) {
            changed = false;

            for (Achievement achievement : achievements) {
                if (unlockedIds.contains(achievement.getId())) {
                    continue;
                }

                int value = metricValue(profile, achievement.getMetric());
                if (value < achievement.getTargetValue()) {
                    continue;
                }

                userAchievementRepository.save(UserAchievement.builder()
                        .id(new UserAchievementId(userId, achievement.getId()))
                        .build());
                unlockedIds.add(achievement.getId());
                changed = true;

                xpService.awardXp(userId, achievement.getXpReward(), XP_REASON_ACHIEVEMENT_UNLOCKED, achievement.getId());
                // Перезагружаем профиль — awardXp мог изменить totalXp/currentLevel
                profile = userProfileRepository.findById(userId).orElse(profile);

                notificationService.notify(
                        userId,
                        NotificationType.ACHIEVEMENT_UNLOCKED,
                        "Новое достижение: " + achievement.getTitle(),
                        achievement.getDescription(),
                        "{\"achievementId\":\"" + achievement.getId() + "\",\"xpReward\":" + achievement.getXpReward() + "}"
                );

                log.info("Достижение разблокировано: userId={}, achievementId={}, title={}",
                        userId, achievement.getId(), achievement.getTitle());
            }
        }
    }

    // ==================== Вспомогательные методы ====================

    private int metricValue(UserProfile profile, AchievementMetric metric) {
        return switch (metric) {
            case ROUTES_COMPLETED -> profile.getTotalRoutesCompleted();
            case DISTANCE_METERS -> profile.getTotalDistanceMeters();
            case LANDMARKS_VISITED -> profile.getTotalLandmarksVisited();
            case LEVEL -> profile.getCurrentLevel();
        };
    }

    private AchievementResponse toAchievementResponse(Achievement achievement) {
        return AchievementResponse.builder()
                .id(achievement.getId())
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .icon(buildIconResponse(achievement.getIconFileId()))
                .xpReward(achievement.getXpReward())
                .targetValue(achievement.getTargetValue())
                .build();
    }

    private MediaFileResponse buildIconResponse(UUID iconFileId) {
        if (iconFileId == null) {
            return null;
        }
        return mediaFileRepository.findById(iconFileId)
                .map(f -> MediaFileResponse.builder()
                        .id(f.getId())
                        .filename(f.getOriginalFilename())
                        .contentType(f.getContentType())
                        .createTs(f.getCreatedAt())
                        .sortOrder(f.getSortOrder())
                        .build())
                .orElse(null);
    }

    private UUID getCurrentUserId() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        return userDetails.getId();
    }
}

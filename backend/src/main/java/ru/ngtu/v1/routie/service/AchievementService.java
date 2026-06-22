package ru.ngtu.v1.routie.service;

import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.gamification.AchievementResponse;
import ru.ngtu.v1.routie.dto.gamification.AchievementsListResponse;
import ru.ngtu.v1.routie.dto.gamification.AllAchievementsResponse;

import java.util.UUID;

public interface AchievementService {

    /** Достижения текущего пользователя с прогрессом (включая неразблокированные). */
    AchievementsListResponse getUserAchievements();

    /** Полный каталог достижений системы. */
    AllAchievementsResponse getAllAchievements();

    /**
     * Заменяет иконку достижения: старый файл (если был) удаляется из MinIO,
     * новый загружается и привязывается.
     */
    AchievementResponse updateIcon(UUID achievementId, MultipartFile file);

    /**
     * Проверяет все недостигнутые достижения пользователя на основании его текущей статистики
     * ({@link ru.ngtu.v1.routie.model.UserProfile}) и разблокирует те, чей порог достигнут.
     * За каждое новое достижение начисляется XP и отправляется уведомление.
     * <p>
     * Вызывается после событий, влияющих на метрики достижений: завершение маршрута,
     * начисление XP (внутри собственного цикла начисления наград за достижения).
     */
    void evaluateForUser(UUID userId);
}

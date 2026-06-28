package ru.ngtu.v1.routie.service;

import java.util.Collection;
import java.util.Map;
import java.util.UUID;

public interface XpService {

    /**
     * Начисляет XP пользователю: создаёт запись в журнале и обновляет
     * {@code totalXp}/{@code currentLevel} в его профиле.
     *
     * @param userId      пользователь, которому начисляется XP
     * @param amount      кол-во XP (положительное число)
     * @param reason      источник начисления, например {@code ROUTE_COMPLETED}
     * @param referenceId необязательная ссылка на сущность-источник (например, ID сессии)
     */
    void awardXp(UUID userId, int amount, String reason, UUID referenceId);

    /** Сумма начисленного XP пользователю, начиная с указанного момента (включительно). */
    long getPeriodXp(UUID userId, java.time.Instant since);

    /** Сумма начисленного XP за период для набора пользователей: userId → periodXp. */
    Map<UUID, Long> getPeriodXpBulk(Collection<UUID> userIds, java.time.Instant since);
}

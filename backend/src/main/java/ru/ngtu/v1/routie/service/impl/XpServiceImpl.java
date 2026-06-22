package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.v1.routie.exception.EntityNotFoundException;
import ru.ngtu.v1.routie.model.UserProfile;
import ru.ngtu.v1.routie.model.XpTransaction;
import ru.ngtu.v1.routie.repository.UserProfileRepository;
import ru.ngtu.v1.routie.repository.XpTransactionRepository;
import ru.ngtu.v1.routie.repository.projection.UserXpSum;
import ru.ngtu.v1.routie.service.XpService;

import java.time.Instant;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class XpServiceImpl implements XpService {

    /** Кол-во XP, необходимое для перехода на следующий уровень. */
    private static final int XP_PER_LEVEL = 1000;

    private final XpTransactionRepository xpTransactionRepository;
    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional
    public void awardXp(UUID userId, int amount, String reason, UUID referenceId) {
        if (amount <= 0) {
            return;
        }

        XpTransaction transaction = XpTransaction.builder()
                .userId(userId)
                .amount(amount)
                .reason(reason)
                .referenceId(referenceId)
                .build();
        xpTransactionRepository.save(transaction);

        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Профиль", userId));

        int newTotalXp = profile.getTotalXp() + amount;
        profile.setTotalXp(newTotalXp);
        profile.setCurrentLevel(calculateLevel(newTotalXp));
        userProfileRepository.save(profile);

        log.info("Начислено {} XP пользователю {} (причина={}, totalXp={}, level={})",
                amount, userId, reason, newTotalXp, profile.getCurrentLevel());
    }

    @Override
    @Transactional(readOnly = true)
    public long getPeriodXp(UUID userId, Instant since) {
        return xpTransactionRepository.sumAmountByUserIdSince(userId, since);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<UUID, Long> getPeriodXpBulk(Collection<UUID> userIds, Instant since) {
        if (userIds.isEmpty()) {
            return Map.of();
        }
        return xpTransactionRepository.sumAmountByUserIdsSince(userIds, since).stream()
                .collect(Collectors.toMap(UserXpSum::getUserId, UserXpSum::getTotal));
    }

    private int calculateLevel(int totalXp) {
        return 1 + (totalXp / XP_PER_LEVEL);
    }
}

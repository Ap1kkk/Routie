package ru.ngtu.twosteps.user.achievements;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.ngtu.twosteps.jpa.entity.Achievement;
import ru.ngtu.twosteps.jpa.entity.user.UserAchievement;
import ru.ngtu.twosteps.jpa.repository.AchievementRepository;
import ru.ngtu.twosteps.jpa.entity.route.history.HistoryRoute;
import ru.ngtu.twosteps.jpa.repository.HistoryRouteRepository;
import ru.ngtu.twosteps.jpa.entity.route.history.HistoryRouteStatus;
import ru.ngtu.twosteps.common.exceptions.classes.data.EntityNotFoundException;
import ru.ngtu.twosteps.jpa.entity.user.User;

import java.time.ZonedDateTime;
import java.util.List;
import ru.ngtu.twosteps.jpa.repository.user.UserAchievementRepository;

/**
 * @author Egor Bokov
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserAchievementService {

    private static final long PIONEER = 1L;
    private static final long ROUTE_CONQUEROR = 2L;
    private static final long ACTIVE_DAY = 3L;
    private static final long MARATHON_RUNNER = 4L;
    private static final long I_AM_SPEED = 5L;
    private static final long SPEEDRUNNER = 6L;

    private final UserAchievementRepository userAchievementRepository;
    private final HistoryRouteRepository historyRouteRepository;
    private final AchievementRepository achievementRepository;

    public void handleAchievements(HistoryRoute historyRoute) {
        User user = historyRoute.getUser();
        long achievementsCount = userAchievementRepository.count();
        List<UserAchievement> achieved = userAchievementRepository.findAllByUser_Id(user.getId());

        if(achieved.size() > achievementsCount)
            return;

        handleCountAchievements(user);
        handleDistanceAchievements(user);
        handleTimingAchievements(user, historyRoute);
    }

    private void handleCountAchievements(User user) {
        long l = historyRouteRepository.countFinishedRoutes(user.getId(), HistoryRouteStatus.FINISHED);

        if(l == 1L)
            applyPioneer(user);
        if(l == 20L)
            applyRouteConqueror(user);
    }

    private void handleDistanceAchievements(User user) {
        long totalDistance = historyRouteRepository.getTotalDistance(user.getId());

        if(totalDistance >= 42000L)
            applyMarathonRunner(user);

        ZonedDateTime startOfDay = getStartOfDay();
        long totalDayDistance = historyRouteRepository.getTotalDayDistance(user.getId(), startOfDay);
        if(totalDayDistance >= 15000L)
            applyActiveDay(user);
    }

    private void handleTimingAchievements(User user, HistoryRoute historyRoute) {
        boolean isGreaterDeltaExists = historyRouteRepository.countWhereGreaterDeltaExists(historyRoute.getDelta()) > 0;

        if(isGreaterDeltaExists)
            applyIAmSpeed(user);

        ZonedDateTime startOfDay = getStartOfDay();

        long dailyCompletedRoutes = historyRouteRepository.countDailyRoutes(user.getId(), startOfDay);
        if(dailyCompletedRoutes >= 3)
            applySpeedrunner(user);
    }

    private ZonedDateTime getStartOfDay() {
        ZonedDateTime now = ZonedDateTime.now();
        return ZonedDateTime.of(now.getYear(), now.getMonth().getValue(), now.getDayOfMonth(), 0, 0, 0, 0, now.getZone());
    }

    private void applyIAmSpeed(User user) {
        applyAchievement(I_AM_SPEED, user);
    }

    private void applyRouteConqueror(User user) {
        applyAchievement(ROUTE_CONQUEROR, user);
    }

    private void applyPioneer(User user) {
        applyAchievement(PIONEER, user);
    }

    private void applyMarathonRunner(User user) {
        applyAchievement(MARATHON_RUNNER, user);
    }

    private void applyActiveDay(User user) {
        applyAchievement(ACTIVE_DAY, user);
    }

    private void applySpeedrunner(User user) {
        applyAchievement(SPEEDRUNNER, user);
    }

    private void applyAchievement(long achievementId, User user) {
        if(isAchieved(achievementId, user))
            return;

        log.debug("[Achievement]: user [{}] achieved [{}]", user.getId(), achievementId);
        Achievement achievement = getAchievementById(achievementId);
        userAchievementRepository.save(UserAchievement
                .builder()
                .user(user)
                .achievement(achievement)
                .build()
        );
    }

    private boolean isAchieved(Long achievementId, User user) {
        return userAchievementRepository.countAchieved(achievementId, user.getId()) > 0;
    }
    private Achievement getAchievementById(long id) {
        return achievementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Achievement.class, id));
    }
}

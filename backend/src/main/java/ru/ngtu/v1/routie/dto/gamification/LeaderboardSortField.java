package ru.ngtu.v1.routie.dto.gamification;

public enum LeaderboardSortField {
    /** Сортировка по XP, заработанному в указанном периоде. */
    TOTAL_XP,
    /** Сортировка по суммарной пройденной дистанции (за всё время — без привязки к периоду). */
    TOTAL_DISTANCE_METERS,
    /** Сортировка по кол-ву завершённых маршрутов (за всё время — без привязки к периоду). */
    TOTAL_ROUTES_COMPLETED
}

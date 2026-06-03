package ru.ngtu.v1.routie.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.statistics.GamificationStatisticsResponse;
import ru.ngtu.v1.routie.dto.statistics.PopularRoutesResponse;
import ru.ngtu.v1.routie.dto.statistics.StatisticsOverviewResponse;
import ru.ngtu.v1.routie.dto.statistics.UserActivityResponse;
import ru.ngtu.v1.routie.service.StatisticsService;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {

    @Override
    public StatisticsOverviewResponse getOverview(LocalDate startDate, LocalDate endDate) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public PageResponse<UserActivityResponse> getUsersActivity(
            LocalDate startDate, LocalDate endDate, int page, int size) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public PopularRoutesResponse getPopularRoutes(LocalDate startDate, LocalDate endDate, int limit) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public GamificationStatisticsResponse getGamificationStatistics(LocalDate startDate, LocalDate endDate) {
        // TODO: implement
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

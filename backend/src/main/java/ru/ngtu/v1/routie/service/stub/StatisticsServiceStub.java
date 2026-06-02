package ru.ngtu.v1.routie.service.stub;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.statistics.GamificationStatisticsResponse;
import ru.ngtu.v1.routie.dto.statistics.PopularRoutesResponse;
import ru.ngtu.v1.routie.dto.statistics.StatisticsOverviewResponse;
import ru.ngtu.v1.routie.dto.statistics.UserActivityResponse;
import ru.ngtu.v1.routie.service.StatisticsService;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@Profile("stub")
@Primary
public class StatisticsServiceStub implements StatisticsService {

    @Override
    public StatisticsOverviewResponse getOverview(LocalDate startDate, LocalDate endDate) {
        log.debug("[STUB] getOverview startDate={}, endDate={}", startDate, endDate);
        return FakeDataFactory.fakeStatisticsOverview();
    }

    @Override
    public PageResponse<UserActivityResponse> getUsersActivity(
            LocalDate startDate, LocalDate endDate, int page, int size) {
        log.debug("[STUB] getUsersActivity page={}, size={}", page, size);
        long total = 312L;
        List<UserActivityResponse> content = FakeDataFactory.fakeUserActivityList(size);
        return FakeDataFactory.fakePage(content, page, size, total);
    }

    @Override
    public PopularRoutesResponse getPopularRoutes(LocalDate startDate, LocalDate endDate, int limit) {
        log.debug("[STUB] getPopularRoutes limit={}", limit);
        return FakeDataFactory.fakePopularRoutes(limit);
    }

    @Override
    public GamificationStatisticsResponse getGamificationStatistics(LocalDate startDate, LocalDate endDate) {
        log.debug("[STUB] getGamificationStatistics startDate={}, endDate={}", startDate, endDate);
        return FakeDataFactory.fakeGamificationStatistics();
    }
}

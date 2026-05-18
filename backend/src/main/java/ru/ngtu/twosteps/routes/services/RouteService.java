package ru.ngtu.twosteps.routes.services;

import java.util.ArrayList;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.twosteps.auth.AuthService;
import ru.ngtu.twosteps.jpa.entity.Category;
import ru.ngtu.twosteps.category.CategoryService;
import ru.ngtu.twosteps.file.FileService;
import ru.ngtu.twosteps.file.enums.ApplicationTargetDirectory;
import ru.ngtu.twosteps.routes.RouteValidator;
import ru.ngtu.twosteps.routes.dto.GetRecommendationRoutesDto;
import ru.ngtu.twosteps.routes.dto.RecommendationRoutesDto;
import ru.ngtu.twosteps.routes.dto.RouteDto;
import ru.ngtu.twosteps.jpa.entity.route.RouteFilter;
import ru.ngtu.twosteps.jpa.repository.RouteRepository;
import ru.ngtu.twosteps.jpa.entity.route.RouteSpecification;
import ru.ngtu.twosteps.routes.mappers.RouteMapper;
import ru.ngtu.twosteps.jpa.entity.route.Route;
import ru.ngtu.twosteps.common.exceptions.classes.data.EntityNotFoundException;
import ru.ngtu.twosteps.common.exceptions.classes.validation.ValidationException;
import ru.ngtu.twosteps.jpa.entity.user.User;

import java.util.List;

/**
 * @author Egor Bokov
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RouteService {

    private final RouteRepository repository;
    private final RouteMapper routeMapper;
    private final RouteValidator validator;

    private final AuthService authService;
    private final CategoryService categoryService;
    private final FileService fileService;

    public List<Route> getAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Route getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Route.class, id));
    }

    @Transactional(readOnly = true)
    public List<Route> getFilteredRoutes(RouteFilter filter) {
        return repository.findAll(RouteSpecification.withFilters(filter));
    }

    @Transactional
    @SneakyThrows
    public Route create(RouteDto dto) {
        log.debug("[Route] : Creating route from dto: {}", dto);

        Route entity = routeMapper.toEntity(dto);
        routeMapper.linkCheckpoints(entity);
        List<Category> categories = categoryService.getByIds(dto.getCategoryIds());
        entity.setCategories(categories);
        String imagePath = fileService.upload(dto.getImage(), ApplicationTargetDirectory.ROUTE_IMAGES);
        entity.setImagePath(imagePath);

        return repository.save(entity);
    }

    @Transactional
    public void delete(Long id) {
        log.debug("[Route] : Deleting route by id: {}", id);

        Route route = validator.throwIfNotExist(id);
        repository.delete(route);
    }

    public Route save(Route entity) {
        return repository.save(entity);
    }

    public Route getDaily() {
        Long minimumId = repository.findMinimumId();
        return repository.findById(minimumId).orElseThrow(() -> new EntityNotFoundException(Route.class, minimumId));
    }

    public List<Route> getPopular(int limit) {
        return repository.findPopular(limit);
    }

    public List<Route> getPopularFiltered(RouteFilter filter, int limit) {
        return repository.findAll(RouteSpecification.withFilters(filter), Pageable.ofSize(limit)).stream().toList();
    }

    public List<Route> search(String searchQuery, RouteFilter filter) {
        if(Strings.isBlank(searchQuery))
            throw ValidationException.builder().message("Search search query must not be blank").build();

        return repository.findAll(RouteSpecification.withFilters(searchQuery, filter));
    }

    public List<Route> getRecommended(int limit) {
        return getRecommended(limit, null);
    }

    public List<Route> getRecommended(int limit, RouteFilter filter) {
        User currentUser = authService.getCurrentUser();

        GetRecommendationRoutesDto dto = GetRecommendationRoutesDto
                .builder()
                .userId(currentUser.getId())
                .filter(filter)
                .build();
        //TODO добавить логику по получению рекомендаций
        log.error("[Route] : getRecommended not implemented!");
//        RecommendationRoutesDto recommendations = analyticsClient.getRecommendations(dto);

//        List<Long> recommendationIds = recommendations.getRecommendations();
//        if(recommendationIds == null || recommendations.getRecommendations().isEmpty()) {
//            log.warn("[Route]: recommendations were empty");
//            return getPopular(limit);
//        }
//
//        return repository.findAllById(recommendationIds);
        return new ArrayList<>();
    }
}

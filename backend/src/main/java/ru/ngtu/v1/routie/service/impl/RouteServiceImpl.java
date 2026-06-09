package ru.ngtu.v1.routie.service.impl;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Subquery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.audioguide.response.AudioGuideResponse;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.landmark.response.LandmarkResponse;
import ru.ngtu.v1.routie.dto.route.RouteType;
import ru.ngtu.v1.routie.dto.route.request.CheckpointCreateRequest;
import ru.ngtu.v1.routie.dto.route.request.RouteCreateRequest;
import ru.ngtu.v1.routie.dto.route.request.RouteSearchFilter;
import ru.ngtu.v1.routie.dto.route.response.CheckpointFullResponse;
import ru.ngtu.v1.routie.dto.route.response.RouteFullResponse;
import ru.ngtu.v1.routie.dto.route.response.RouteShortResponse;
import ru.ngtu.v1.routie.dto.tag.TagResponse;
import ru.ngtu.v1.routie.exception.BadRequestException;
import ru.ngtu.v1.routie.exception.EntityNotFoundException;
import ru.ngtu.v1.routie.model.*;
import ru.ngtu.v1.routie.repository.*;
import ru.ngtu.v1.routie.service.FileService;
import ru.ngtu.v1.routie.service.RouteService;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {

  private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
      "image/jpeg", "image/png", "image/webp", "image/gif"
  );

  private final RouteRepository routeRepository;
  private final LandmarkRepository landmarkRepository;
  private final TagRepository tagRepository;
  private final AudioGuideRepository audioGuideRepository;
  private final MediaFileRepository mediaFileRepository;
  private final FileService fileService;

  // ==================== Чтение ====================

  @Override
  @Transactional(readOnly = true)
  public RouteShortResponse getRouteShort(UUID routeId) {
    return toShortResponse(findById(routeId));
  }

  @Override
  @Transactional(readOnly = true)
  public RouteFullResponse getRouteFull(UUID routeId) {
    return toFullResponse(findById(routeId));
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<RouteShortResponse> searchRoutes(RouteSearchFilter filter) {
    Specification<Route> spec = buildSpecification(filter);
    Sort sort = buildSort(filter.getSort());
    PageRequest pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

    Page<Route> page = routeRepository.findAll(spec, pageable);
    return new PageResponse<>(
        page.getContent().stream().map(this::toShortResponse).toList(),
        page.getTotalElements(),
        page.getTotalPages(),
        filter.getPage()
    );
  }

  // ==================== Мутации (только ADMIN) ====================

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  @Transactional
  public RouteShortResponse createRoute(RouteCreateRequest request) {
    validateTagsExist(request.getTagIds());

    Route route = Route.builder()
        .title(request.getTitle())
        .description(request.getDescription())
        .type(request.getType())
        .difficulty(request.getDifficulty())
        .lengthMeters(request.getLengthMeters())
        .estimatedTimeMinutes(request.getEstimatedTimeMinutes())
        .city(request.getCity())
        .tagIds(
            request.getTagIds() != null ? new ArrayList<>(request.getTagIds()) : new ArrayList<>())
        .build();

    buildCheckpoints(request.getCheckpoints(), route);

    route = routeRepository.save(route);
    log.info("Создан маршрут: id={}, title={}", route.getId(), route.getTitle());
    return toShortResponse(route);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  @Transactional
  public RouteShortResponse updateRoute(UUID routeId, RouteCreateRequest request) {
    Route route = findById(routeId);
    validateTagsExist(request.getTagIds());

    route.setTitle(request.getTitle());
    route.setDescription(request.getDescription());
    route.setType(request.getType());
    route.setDifficulty(request.getDifficulty());
    route.setLengthMeters(request.getLengthMeters());
    route.setEstimatedTimeMinutes(request.getEstimatedTimeMinutes());
    route.setCity(request.getCity());

    // Заменяем теги
    if (request.getTagIds() != null) {
      route.getTagIds().clear();
      route.getTagIds().addAll(request.getTagIds());
    }

    // Заменяем checkpoints (orphanRemoval удаляет старые)
    route.getCheckpoints().clear();
    buildCheckpoints(request.getCheckpoints(), route);

    route = routeRepository.save(route);
    log.info("Обновлён маршрут: id={}", routeId);
    return toShortResponse(route);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  @Transactional
  public void deleteRoute(UUID routeId) {
    Route route = findById(routeId);

    // Удаляем файлы из MinIO перед удалением записи
    for (UUID fileId : new ArrayList<>(route.getImageFileIds())) {
      try {
        fileService.delete(fileId);
      } catch (Exception e) {
        log.warn("Не удалось удалить файл {} при удалении маршрута {}: {}", fileId, routeId,
            e.getMessage());
      }
    }

    routeRepository.delete(route);
    log.info("Удалён маршрут: id={}", routeId);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  @Transactional
  public void publishRoute(UUID routeId) {
    Route route = findById(routeId);
    route.setIsActive(true);
    routeRepository.save(route);
    log.info("Маршрут опубликован: id={}", routeId);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  @Transactional
  public List<MediaFileResponse> uploadImages(UUID routeId, List<MultipartFile> files) {
    Route route = findById(routeId);

    List<MediaFileResponse> uploaded = new ArrayList<>();
    int nextSortOrder = route.getImageFileIds().size();

    for (MultipartFile file : files) {
      String contentType = file.getContentType();
      if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType)) {
        throw new BadRequestException(
            "Недопустимый тип файла: " + contentType + ". Разрешены: " + ALLOWED_IMAGE_TYPES
        );
      }
      MediaFileResponse response = fileService.upload(file, nextSortOrder++);
      route.getImageFileIds().add(response.getId());
      uploaded.add(response);
    }

    routeRepository.save(route);
    log.info("Загружено {} изображений для маршрута {}", uploaded.size(), routeId);
    return uploaded;
  }

  // ==================== Вспомогательные методы ====================

  private Route findById(UUID id) {
    return routeRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Маршрут", id));
  }

  private void validateTagsExist(List<UUID> tagIds) {
    if (tagIds == null || tagIds.isEmpty()) {
      return;
    }
    List<UUID> foundIds = tagRepository.findAllByIdIn(tagIds).stream().map(Tag::getId).toList();
    List<UUID> missingIds = tagIds.stream().filter(id -> !foundIds.contains(id)).toList();
    if (!missingIds.isEmpty()) {
      throw new EntityNotFoundException("Теги не найдены: " + missingIds);
    }
  }

  private void buildCheckpoints(List<CheckpointCreateRequest> requests, Route route) {
    if (requests == null) {
      return;
    }
    for (CheckpointCreateRequest req : requests) {
      Landmark landmark = null;
      if (req.getLandmarkId() != null) {
        landmark = landmarkRepository.findById(req.getLandmarkId()).orElse(null);
      }
      Checkpoint cp = Checkpoint.builder()
          .route(route)
          .latitude(req.getLatitude())
          .longitude(req.getLongitude())
          .sortOrder(req.getSortOrder())
          .landmark(landmark)
          .build();
      route.getCheckpoints().add(cp);
    }
  }

  // ==================== Specification для поиска ====================

  private boolean isCurrentUserAdmin() {
    return SecurityContextHolder.getContext().getAuthentication()
        .getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
  }

  private Specification<Route> buildSpecification(RouteSearchFilter filter) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      // USER видит только активные маршруты, ADMIN — все
      if (!isCurrentUserAdmin()) {
        predicates.add(cb.isTrue(root.get("isActive")));
      }

      if (filter.getSearch() != null && !filter.getSearch().isBlank()) {
        predicates.add(cb.like(
            cb.lower(root.get("title")),
            "%" + filter.getSearch().toLowerCase() + "%"
        ));
      }

      if (filter.getType() != null && !filter.getType().isBlank()) {
        try {
          RouteType type = RouteType.valueOf(filter.getType().toUpperCase());
          predicates.add(cb.equal(root.get("type"), type));
        } catch (IllegalArgumentException ignored) {
          // неизвестный тип — игнорируем
        }
      }

      if (filter.getDifficultyMin() != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("difficulty"), filter.getDifficultyMin()));
      }
      if (filter.getDifficultyMax() != null) {
        predicates.add(cb.lessThanOrEqualTo(root.get("difficulty"), filter.getDifficultyMax()));
      }
      if (filter.getLengthMin() != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("lengthMeters"), filter.getLengthMin()));
      }
      if (filter.getLengthMax() != null) {
        predicates.add(cb.lessThanOrEqualTo(root.get("lengthMeters"), filter.getLengthMax()));
      }
      if (filter.getEstimatedTimeMin() != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("estimatedTimeMinutes"),
            filter.getEstimatedTimeMin()));
      }
      if (filter.getEstimatedTimeMax() != null) {
        predicates.add(
            cb.lessThanOrEqualTo(root.get("estimatedTimeMinutes"), filter.getEstimatedTimeMax()));
      }

      if (filter.getCity() != null && !filter.getCity().isBlank()) {
        predicates.add(cb.like(
            cb.lower(root.get("city")),
            "%" + filter.getCity().toLowerCase() + "%"
        ));
      }

      // Фильтр по тегам: comma-separated UUID строки
      if (filter.getTags() != null && !filter.getTags().isBlank()) {
        List<UUID> tagIds = Arrays.stream(filter.getTags().split(","))
            .map(String::trim)
            .filter(s -> !s.isBlank())
            .map(s -> {
              try {
                return UUID.fromString(s);
              } catch (IllegalArgumentException e) {
                return null;
              }
            })
            .filter(Objects::nonNull)
            .toList();

        if (!tagIds.isEmpty()) {
          var tagJoin = root.join("tagIds", JoinType.INNER);
          predicates.add(tagJoin.in(tagIds));
          query.distinct(true);
        }
      }

      // Фильтр hasAudioGuide: EXISTS checkpoint с landmark у которого audioGuideId != null
      if (Boolean.TRUE.equals(filter.getHasAudioGuide())) {
        Subquery<Integer> sub = query.subquery(Integer.class);
        var cpRoot = sub.from(Checkpoint.class);
        var lmJoin = cpRoot.join("landmark", JoinType.INNER);
        sub.select(cb.literal(1))
            .where(
                cb.equal(cpRoot.get("route"), root),
                cb.isNotNull(lmJoin.get("audioGuideId"))
            );
        predicates.add(cb.exists(sub));
      }

      // favoriteOnly пока не реализован (нет таблицы избранного)

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  private Sort buildSort(String sort) {
    if (sort == null || sort.isBlank()) {
      return Sort.by("createdAt").descending();
    }
    return switch (sort.toLowerCase()) {
      case "difficulty" -> Sort.by("difficulty").ascending();
      case "length" -> Sort.by("lengthMeters").ascending();
      case "time" -> Sort.by("estimatedTimeMinutes").ascending();
      case "popular" -> Sort.by("completionsCount").descending();
      default -> Sort.by("createdAt").descending();
    };
  }

  // ==================== Маппинг в DTO ====================

  private RouteShortResponse toShortResponse(Route route) {
    return RouteShortResponse.builder()
        .id(route.getId())
        .title(route.getTitle())
        .description(route.getDescription())
        .type(route.getType().name())
        .difficulty(route.getDifficulty())
        .lengthMeters(route.getLengthMeters())
        .estimatedTimeMinutes(route.getEstimatedTimeMinutes())
        .city(route.getCity())
        .completionsCount(route.getCompletionsCount())
        .isActive(route.getIsActive())
        .images(buildImageResponses(route.getImageFileIds()))
        .tags(buildTagResponses(route.getTagIds()))
        .build();
  }

  private RouteFullResponse toFullResponse(Route route) {
    return RouteFullResponse.builder()
        .id(route.getId())
        .title(route.getTitle())
        .description(route.getDescription())
        .type(route.getType().name())
        .difficulty(route.getDifficulty())
        .lengthMeters(route.getLengthMeters())
        .estimatedTimeMinutes(route.getEstimatedTimeMinutes())
        .city(route.getCity())
        .completionsCount(route.getCompletionsCount())
        .isActive(route.getIsActive())
        .images(buildImageResponses(route.getImageFileIds()))
        .tags(buildTagResponses(route.getTagIds()))
        .checkpoints(route.getCheckpoints().stream().map(this::toCheckpointResponse).toList())
        .build();
  }

  private CheckpointFullResponse toCheckpointResponse(Checkpoint cp) {
    LandmarkResponse landmarkResponse = null;
    if (cp.getLandmark() != null) {
      Landmark lm = cp.getLandmark();
      landmarkResponse = LandmarkResponse.builder()
          .id(lm.getId())
          .title(lm.getTitle())
          .description(lm.getDescription())
          .images(buildImageResponses(lm.getImageFileIds()))
          .audioGuide(buildAudioGuideResponse(lm.getAudioGuideId()))
          .build();
    }
    return CheckpointFullResponse.builder()
        .id(cp.getId())
        .latitude(cp.getLatitude())
        .longitude(cp.getLongitude())
        .sortOrder(cp.getSortOrder())
        .landmark(landmarkResponse)
        .build();
  }

  private List<TagResponse> buildTagResponses(List<UUID> tagIds) {
    if (tagIds == null || tagIds.isEmpty()) {
      return List.of();
    }
    return tagRepository.findAllByIdIn(tagIds).stream()
        .map(tag -> TagResponse.builder()
            .id(tag.getId())
            .title(tag.getTitle())
            .build())
        .toList();
  }

  private List<MediaFileResponse> buildImageResponses(List<UUID> fileIds) {
    if (fileIds == null || fileIds.isEmpty()) {
      return List.of();
    }
    return fileIds.stream()
        .map(id -> mediaFileRepository.findById(id)
            .map(file -> MediaFileResponse.builder()
                .id(file.getId())
                .filename(file.getOriginalFilename())
                .contentType(file.getContentType())
                .createTs(file.getCreatedAt())
                .sortOrder(file.getSortOrder())
                .build())
            .orElse(null))
        .filter(Objects::nonNull)
        .toList();
  }

  private AudioGuideResponse buildAudioGuideResponse(UUID audioGuideId) {
    if (audioGuideId == null) {
      return null;
    }
    return audioGuideRepository.findById(audioGuideId)
        .map(ag -> AudioGuideResponse.builder()
            .id(ag.getId())
            .title(ag.getTitle())
            .durationSeconds(ag.getDurationSeconds())
            .file(ag.getFileId() != null
                ? mediaFileRepository.findById(ag.getFileId())
                .map(file -> MediaFileResponse.builder()
                    .id(file.getId())
                    .filename(file.getOriginalFilename())
                    .contentType(file.getContentType())
                    .createTs(file.getCreatedAt())
                    .sortOrder(file.getSortOrder())
                    .build())
                .orElse(null)
                : null)
            .build())
        .orElse(null);
  }
}

package ru.ngtu.v1.routie.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.profile.Gender;
import ru.ngtu.v1.routie.dto.profile.ProfileUpdateRequest;
import ru.ngtu.v1.routie.dto.profile.UserProfileFullResponse;
import ru.ngtu.v1.routie.dto.profile.UserProfileShortResponse;
import ru.ngtu.v1.routie.dto.profile.UserStatisticsResponse;
import ru.ngtu.v1.routie.dto.session.RouteSessionStatus;
import ru.ngtu.v1.routie.dto.tag.TagResponse;
import ru.ngtu.v1.routie.exception.BadRequestException;
import ru.ngtu.v1.routie.exception.ConflictException;
import ru.ngtu.v1.routie.exception.EntityNotFoundException;
import ru.ngtu.v1.routie.exception.ForbiddenException;
import ru.ngtu.v1.routie.model.Friendship;
import ru.ngtu.v1.routie.model.FriendshipStatus;
import ru.ngtu.v1.routie.model.NotificationType;
import ru.ngtu.v1.routie.model.RouteSession;
import ru.ngtu.v1.routie.model.Tag;
import ru.ngtu.v1.routie.model.User;
import ru.ngtu.v1.routie.model.UserProfile;
import ru.ngtu.v1.routie.repository.CheckpointProgressRepository;
import ru.ngtu.v1.routie.repository.FriendshipRepository;
import ru.ngtu.v1.routie.repository.MediaFileRepository;
import ru.ngtu.v1.routie.repository.RouteSessionRepository;
import ru.ngtu.v1.routie.repository.TagRepository;
import ru.ngtu.v1.routie.repository.UserProfileRepository;
import ru.ngtu.v1.routie.repository.UserRepository;
import ru.ngtu.v1.routie.security.CustomUserDetails;
import ru.ngtu.v1.routie.service.FileService;
import ru.ngtu.v1.routie.service.NotificationService;
import ru.ngtu.v1.routie.service.ProfileService;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.OptionalDouble;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final FriendshipRepository friendshipRepository;
    private final MediaFileRepository mediaFileRepository;
    private final TagRepository tagRepository;
    private final FileService fileService;
    private final RouteSessionRepository routeSessionRepository;
    private final CheckpointProgressRepository checkpointProgressRepository;
    private final NotificationService notificationService;

    /** Средняя длина шага человека, используется для приблизительной оценки кол-ва шагов. */
    private static final double AVG_STEP_LENGTH_METERS = 0.75;

    // ==================== Профиль ====================

    @Override
    @Transactional
    public UserProfileFullResponse getCurrentUserProfile() {
        User currentUser = getCurrentUser();
        UserProfile profile = getOrCreateProfile(currentUser);
        return toFullResponse(currentUser, profile, false);
    }

    @Override
    @Transactional
    public UserProfileFullResponse updateCurrentUserProfile(ProfileUpdateRequest request) {
        User currentUser = getCurrentUser();
        UserProfile profile = getOrCreateProfile(currentUser);

        boolean userDirty = false;

        // Поля сущности User
        if (request.getEmail() != null && !request.getEmail().equals(currentUser.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new ConflictException("Email уже занят");
            }
            currentUser.setEmail(request.getEmail());
            userDirty = true;
        }
        if (request.getUsername() != null && !request.getUsername().equals(currentUser.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new ConflictException("Username уже занят");
            }
            currentUser.setUsername(request.getUsername());
            userDirty = true;
        }
        if (userDirty) {
            userRepository.save(currentUser);
        }

        // Поля UserProfile
        if (request.getName() != null) {
            profile.setName(request.getName());
        }
        if (request.getDateOfBirth() != null) {
            profile.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getGender() != null) {
            profile.setGender(mapGender(request.getGender()));
        }
        if (request.getHeight() != null) {
            profile.setHeight(request.getHeight());
        }
        if (request.getWeight() != null) {
            profile.setWeight(request.getWeight());
        }
        if (request.getPreferredTags() != null) {
            validateTagsExist(request.getPreferredTags());
            profile.setPreferredTagIds(request.getPreferredTags());
        }

        userProfileRepository.save(profile);
        log.info("Профиль обновлён для пользователя: {}", currentUser.getId());
        return toFullResponse(currentUser, profile, false);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileFullResponse getUserProfile(UUID userId) {
        User user = findUserById(userId);
        UserProfile profile = getOrCreateProfile(user);
        boolean isFriend = isFriendWithCurrentUser(user);
        return toFullResponse(user, profile, isFriend);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileShortResponse getShortUserProfile(UUID userId) {
        User user = findUserById(userId);
        UserProfile profile = getOrCreateProfile(user);
        boolean isFriend = isFriendWithCurrentUser(user);
        return toShortResponse(user, profile, isFriend);
    }

    @Override
    @Transactional
    public MediaFileResponse uploadAvatar(MultipartFile file) {
        User currentUser = getCurrentUser();
        UserProfile profile = getOrCreateProfile(currentUser);

        MediaFileResponse response = fileService.upload(file, 0);

        profile.setAvatarFileId(response.getId());
        userProfileRepository.save(profile);

        log.info("Аватар обновлён для пользователя: {}", currentUser.getId());
        return response;
    }

    // ==================== Статистика ====================

    @Override
    @Transactional(readOnly = true)
    public UserStatisticsResponse getCurrentUserStatistics(LocalDate startDate, LocalDate endDate) {
        User currentUser = getCurrentUser();
        UUID userId = currentUser.getId();

        boolean isAllTime = startDate == null && endDate == null;

        if (!isAllTime) {
            if (startDate == null || endDate == null) {
                throw new BadRequestException("startDate и endDate должны быть переданы вместе");
            }
            if (startDate.isAfter(endDate)) {
                throw new BadRequestException("startDate не может быть позже endDate");
            }
        }

        List<RouteSession> finishedSessions;
        int abortedCount;
        long totalCheckpointsReached;

        if (isAllTime) {
            finishedSessions = routeSessionRepository
                    .findAllByUserIdAndStatus(userId, RouteSessionStatus.FINISHED);
            abortedCount = routeSessionRepository
                    .findAllByUserIdAndStatus(userId, RouteSessionStatus.ABORTED)
                    .size();
            totalCheckpointsReached = checkpointProgressRepository.countByUserId(userId);
        } else {
            Instant since = startDate.atStartOfDay(ZoneOffset.UTC).toInstant();
            Instant until = endDate.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

            finishedSessions = routeSessionRepository.findAllByUserIdAndStatusAndStartedAtBetween(
                    userId, RouteSessionStatus.FINISHED, since, until);
            abortedCount = routeSessionRepository
                    .findAllByUserIdAndStatusAndStartedAtBetween(
                            userId, RouteSessionStatus.ABORTED, since, until)
                    .size();
            totalCheckpointsReached = checkpointProgressRepository
                    .countByUserIdAndSessionStartedAtBetween(userId, since, until);
        }

        long totalDurationSeconds = finishedSessions.stream()
                .map(RouteSession::getTotalDurationSeconds)
                .filter(java.util.Objects::nonNull)
                .mapToLong(Long::longValue)
                .sum();

        int totalDistanceMeters = finishedSessions.stream()
                .map(RouteSession::getTotalDistanceMeters)
                .filter(java.util.Objects::nonNull)
                .mapToInt(Integer::intValue)
                .sum();

        OptionalDouble avgDuration = finishedSessions.stream()
                .map(RouteSession::getTotalDurationSeconds)
                .filter(java.util.Objects::nonNull)
                .mapToLong(Long::longValue)
                .average();

        OptionalDouble avgLength = finishedSessions.stream()
                .map(RouteSession::getTotalDistanceMeters)
                .filter(java.util.Objects::nonNull)
                .mapToInt(Integer::intValue)
                .average();

        OptionalDouble avgSpeed = finishedSessions.stream()
                .map(RouteSession::getAvgSpeedKmh)
                .filter(java.util.Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .average();

        return UserStatisticsResponse.builder()
                .periodStart(startDate)
                .periodEnd(endDate)
                .totalRoutesCompleted(finishedSessions.size())
                .totalSessionsAborted(abortedCount)
                .totalDurationSeconds(totalDurationSeconds)
                .totalDistanceMeters(totalDistanceMeters)
                .estimatedTotalSteps(estimateSteps(totalDistanceMeters))
                .totalCheckpointsReached(totalCheckpointsReached)
                .avgSessionDurationSeconds(avgDuration.isPresent() ? avgDuration.getAsDouble() : null)
                .avgRouteLengthMeters(avgLength.isPresent() ? avgLength.getAsDouble() : null)
                .avgSpeedKmh(avgSpeed.isPresent() ? avgSpeed.getAsDouble() : null)
                .build();
    }

    /** Приблизительная оценка кол-ва шагов по дистанции (точных данных о шагах система не собирает). */
    private long estimateSteps(int distanceMeters) {
        return Math.round(distanceMeters / AVG_STEP_LENGTH_METERS);
    }

    // ==================== Друзья ====================

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserProfileShortResponse> getFriends(
            int page, int size, String sort, String search, String status) {
        User currentUser = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);

        FriendshipStatus friendshipStatus = status != null
                ? parseFriendshipStatus(status)
                : FriendshipStatus.ACCEPTED;

        Page<Friendship> friendships = friendshipRepository
                .findAllByUserAndStatus(currentUser, friendshipStatus, pageable);

        List<UserProfileShortResponse> friends = friendships.stream()
                .map(f -> {
                    User friend = f.getRequester().getId().equals(currentUser.getId())
                            ? f.getAddressee()
                            : f.getRequester();
                    UserProfile friendProfile = getOrCreateProfile(friend);
                    return toShortResponse(friend, friendProfile, true);
                })
                .toList();

        return new PageResponse<>(friends, friendships.getTotalElements(),
                friendships.getTotalPages(), page);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserProfileShortResponse> searchUsers(String query, int page, int size) {
        User currentUser = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);

        String normalizedQuery = query != null ? query.trim() : "";

        Page<User> users = userRepository.searchByUsernameOrName(
                currentUser.getId(), normalizedQuery, pageable);

        List<UUID> friendIds = friendshipRepository.findAcceptedFriendIds(currentUser.getId());

        List<UserProfileShortResponse> content = users.stream()
                .map(user -> {
                    UserProfile profile = getOrCreateProfile(user);
                    return toShortResponse(user, profile, friendIds.contains(user.getId()));
                })
                .toList();

        return new PageResponse<>(content, users.getTotalElements(), users.getTotalPages(), page);
    }

    @Override
    @Transactional
    public void sendFriendRequest(UUID friendId) {
        User currentUser = getCurrentUser();

        if (currentUser.getId().equals(friendId)) {
            throw new BadRequestException("Нельзя отправить запрос самому себе");
        }

        User addressee = findUserById(friendId);

        friendshipRepository.findBetweenUsers(currentUser.getId(), friendId)
                .ifPresent(f -> {
                    throw new ConflictException("Запрос в друзья уже существует");
                });

        Friendship friendship = Friendship.builder()
                .requester(currentUser)
                .addressee(addressee)
                .status(FriendshipStatus.PENDING)
                .build();

        friendship = friendshipRepository.save(friendship);
        log.info("Запрос в друзья отправлен: {} -> {}", currentUser.getId(), friendId);

        String senderName = getDisplayName(currentUser);
        notificationService.notify(
                addressee.getId(),
                NotificationType.FRIEND_REQUEST_RECEIVED,
                senderName + " хочет добавить вас в друзья",
                null,
                "{\"friendshipId\":\"" + friendship.getId() + "\",\"fromUserId\":\"" + currentUser.getId() + "\"}"
        );
    }

    @Override
    @Transactional
    public void acceptFriendRequest(UUID friendshipId) {
        User currentUser = getCurrentUser();
        Friendship friendship = findFriendshipById(friendshipId);

        if (!friendship.getAddressee().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("Вы не являетесь адресатом этого запроса");
        }
        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new BadRequestException("Запрос уже обработан");
        }

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship);
        log.info("Запрос в друзья принят: {}", friendshipId);

        String accepterName = getDisplayName(currentUser);
        notificationService.notify(
                friendship.getRequester().getId(),
                NotificationType.FRIEND_REQUEST_ACCEPTED,
                accepterName + " принял ваш запрос в друзья",
                null,
                "{\"friendshipId\":\"" + friendship.getId() + "\",\"fromUserId\":\"" + currentUser.getId() + "\"}"
        );
    }

    @Override
    @Transactional
    public void rejectFriendRequest(UUID friendshipId) {
        User currentUser = getCurrentUser();
        Friendship friendship = findFriendshipById(friendshipId);

        if (!friendship.getAddressee().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("Вы не являетесь адресатом этого запроса");
        }
        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new BadRequestException("Запрос уже обработан");
        }

        friendship.setStatus(FriendshipStatus.REJECTED);
        friendshipRepository.save(friendship);
        log.info("Запрос в друзья отклонён: {}", friendshipId);
    }

    @Override
    @Transactional
    public void removeFriend(UUID friendId) {
        User currentUser = getCurrentUser();

        Friendship friendship = friendshipRepository
                .findBetweenUsers(currentUser.getId(), friendId)
                .filter(f -> f.getStatus() == FriendshipStatus.ACCEPTED)
                .orElseThrow(() -> new EntityNotFoundException("Дружба с пользователем не найдена"));

        friendshipRepository.delete(friendship);
        log.info("Пользователь {} удалён из друзей {}", friendId, currentUser.getId());
    }


    // ==================== Вспомогательные методы ====================

    private User getCurrentUser() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new EntityNotFoundException("Текущий пользователь не найден"));
    }

    private User findUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Пользователь", userId));
    }

    private Friendship findFriendshipById(UUID friendshipId) {
        return friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new EntityNotFoundException("Запрос в друзья", friendshipId));
    }

    /** Отображаемое имя пользователя для текстов уведомлений: name из профиля, либо username, если name не задано. */
    private String getDisplayName(User user) {
        UserProfile profile = getOrCreateProfile(user);
        return profile.getName() != null ? profile.getName() : user.getUsername();
    }

    private UserProfile getOrCreateProfile(User user) {
        return userProfileRepository.findById(user.getId())
                .orElseGet(() -> {
                    UserProfile profile = UserProfile.builder().user(user).build();
                    return userProfileRepository.save(profile);
                });
    }

    private boolean isFriendWithCurrentUser(User targetUser) {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();
            return friendshipRepository
                    .findBetweenUsers(userDetails.getId(), targetUser.getId())
                    .map(f -> f.getStatus() == FriendshipStatus.ACCEPTED)
                    .orElse(false);
        } catch (ClassCastException e) {
            return false;
        }
    }

    private MediaFileResponse buildAvatarResponse(UUID avatarFileId) {
        if (avatarFileId == null) return null;
        return mediaFileRepository.findById(avatarFileId)
                .map(f -> MediaFileResponse.builder()
                        .id(f.getId())
                        .filename(f.getOriginalFilename())
                        .contentType(f.getContentType())
                        .createTs(f.getCreatedAt())
                        .sortOrder(f.getSortOrder())
                        .build())
                .orElse(null);
    }

    private void validateTagsExist(List<UUID> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) return;
        List<UUID> foundIds = tagRepository.findAllByIdIn(tagIds).stream()
                .map(Tag::getId)
                .toList();
        List<UUID> missingIds = tagIds.stream()
                .filter(id -> !foundIds.contains(id))
                .toList();
        if (!missingIds.isEmpty()) {
            throw new EntityNotFoundException("Теги не найдены: " + missingIds);
        }
    }

    private List<TagResponse> buildTagResponses(List<UUID> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) return Collections.emptyList();
        return tagRepository.findAllByIdIn(tagIds).stream()
                .map(tag -> TagResponse.builder()
                        .id(tag.getId())
                        .title(tag.getTitle())
                        .build())
                .toList();
    }

    private UserProfileFullResponse toFullResponse(User user, UserProfile profile, boolean isFriend) {
        return UserProfileFullResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .name(profile.getName())
                .avatar(buildAvatarResponse(profile.getAvatarFileId()))
                .dateOfBirth(profile.getDateOfBirth())
                .gender(mapGenderToDto(profile.getGender()))
                .height(profile.getHeight())
                .weight(profile.getWeight())
                .preferredTags(buildTagResponses(profile.getPreferredTagIds()))
                .totalXp(profile.getTotalXp())
                .currentLevel(profile.getCurrentLevel())
                .totalDistanceMeters(profile.getTotalDistanceMeters())
                .totalRoutesCompleted(profile.getTotalRoutesCompleted())
                .totalLandmarksVisited(profile.getTotalLandmarksVisited())
                .isFriend(isFriend)
                .createdAt(user.getCreatedAt().atZone(ZoneOffset.UTC).toLocalDateTime())
                .build();
    }

    private UserProfileShortResponse toShortResponse(User user, UserProfile profile, boolean isFriend) {
        return UserProfileShortResponse.builder()
                .id(user.getId())
                .name(profile.getName())
                .username(user.getUsername())
                .avatar(buildAvatarResponse(profile.getAvatarFileId()))
                .currentLevel(profile.getCurrentLevel())
                .totalXp(profile.getTotalXp())
                .isFriend(isFriend)
                .build();
    }

    private ru.ngtu.v1.routie.model.Gender mapGender(Gender dto) {
        if (dto == null) return null;
        return ru.ngtu.v1.routie.model.Gender.valueOf(dto.name());
    }

    private Gender mapGenderToDto(ru.ngtu.v1.routie.model.Gender model) {
        if (model == null) return null;
        return Gender.valueOf(model.name());
    }

    private FriendshipStatus parseFriendshipStatus(String value) {
        try {
            return FriendshipStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Неизвестный статус дружбы: " + value);
        }
    }
}

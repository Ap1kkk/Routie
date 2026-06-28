package ru.ngtu.v1.routie.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.profile.ProfileUpdateRequest;
import ru.ngtu.v1.routie.dto.profile.UserProfileFullResponse;
import ru.ngtu.v1.routie.dto.profile.UserProfileShortResponse;
import ru.ngtu.v1.routie.dto.profile.UserStatisticsResponse;

import java.time.LocalDate;

public interface ProfileService {

  UserProfileFullResponse getCurrentUserProfile();
  UserProfileFullResponse updateCurrentUserProfile(ProfileUpdateRequest request);
  UserProfileFullResponse getUserProfile(UUID userId);
  UserProfileShortResponse getShortUserProfile(UUID userId);

  /**
   * Статистика текущего пользователя за выбранный диапазон дат (для экрана профиля).
   * Если оба параметра не переданы — статистика рассчитывается за всё время.
   *
   * @param startDate начало диапазона (включительно); либо оба параметра заданы, либо оба null
   * @param endDate   конец диапазона (включительно); либо оба параметра заданы, либо оба null
   */
  UserStatisticsResponse getCurrentUserStatistics(LocalDate startDate, LocalDate endDate);

  MediaFileResponse uploadAvatar(MultipartFile file);

  // Друзья
  PageResponse<UserProfileShortResponse> getFriends(int page, int size, String sort, String search, String status);
  PageResponse<UserProfileShortResponse> searchUsers(String query, int page, int size);
  void sendFriendRequest(UUID friendId);
  void acceptFriendRequest(UUID friendshipId);
  void rejectFriendRequest(UUID friendshipId);
  void removeFriend(UUID friendId);
}
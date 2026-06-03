package ru.ngtu.v1.routie.service.impl;

import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.ngtu.v1.routie.dto.common.MediaFileResponse;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.profile.ProfileUpdateRequest;
import ru.ngtu.v1.routie.dto.profile.UserProfileFullResponse;
import ru.ngtu.v1.routie.dto.profile.UserProfileShortResponse;
import ru.ngtu.v1.routie.dto.route.response.RouteShortResponse;
import ru.ngtu.v1.routie.service.ProfileService;

@Slf4j
@Service
public class ProfileServiceImpl implements ProfileService {

  private static final UUID MOCK_USER_ID = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");

  @Override
  public UserProfileFullResponse getCurrentUserProfile() {
    log.info("Мок: получение полного профиля текущего пользователя");
    return createMockFullProfile(MOCK_USER_ID);
  }

  @Override
  public UserProfileFullResponse updateCurrentUserProfile(ProfileUpdateRequest request) {
    log.info("Мок: обновление профиля");
    return createMockFullProfile(MOCK_USER_ID);
  }

  @Override
  public UserProfileFullResponse getUserProfile(UUID userId) {
    log.info("Мок: получение профиля пользователя {}", userId);
    return createMockFullProfile(userId);
  }

  @Override
  public UserProfileShortResponse getShortUserProfile(UUID userId) {
    log.info("Мок: получение краткого профиля {}", userId);
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public MediaFileResponse uploadAvatar(MultipartFile file) {
    log.info("Мок: загрузка аватарки");
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public PageResponse<UserProfileShortResponse> getFriends(int page, int size, String sort,
      String search, String status) {
    log.info("Мок: получение списка друзей");
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public void sendFriendRequest(UUID friendId) {
    log.info("Мок: отправка запроса в друзья {}", friendId);
  }

  @Override
  public void acceptFriendRequest(UUID friendshipId) {
    log.info("Мок: принятие запроса {}", friendshipId);
  }

  @Override
  public void rejectFriendRequest(UUID friendshipId) {
    log.info("Мок: отклонение запроса {}", friendshipId);
  }

  @Override
  public void removeFriend(UUID friendId) {
    log.info("Мок: удаление из друзей {}", friendId);
  }

  @Override
  public PageResponse<RouteShortResponse> getFavorites(int page, int size) {
    log.info("Мок: получение избранных маршрутов");
    throw new UnsupportedOperationException("Not implemented yet");
  }

  private UserProfileFullResponse createMockFullProfile(UUID id) {
    throw new UnsupportedOperationException("Not implemented yet");
  }
}
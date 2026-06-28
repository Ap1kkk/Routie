package ru.ngtu.v1.routie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.ngtu.v1.routie.dto.common.ApiResponse;
import ru.ngtu.v1.routie.dto.common.ApiResponseVoid;
import ru.ngtu.v1.routie.dto.common.PageResponse;
import ru.ngtu.v1.routie.dto.profile.UserProfileShortResponse;
import ru.ngtu.v1.routie.service.ProfileService;

@RestController
@RequestMapping("/api/v1/profile/friends")
@RequiredArgsConstructor
@Tag(name = "Friends", description = "Управление друзьями")
public class FriendsControllerV1 {

  private final ProfileService profileService;

  @GetMapping
  @Operation(summary = "Получение списка друзей и запросов")
  public ApiResponse<PageResponse<UserProfileShortResponse>> getFriends(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      @RequestParam(required = false) String sort,
      @RequestParam(required = false) String search,
      @RequestParam(required = false) String status) {
    return ApiResponse.of(profileService.getFriends(page, size, sort, search, status));
  }

  @GetMapping("/search")
  @Operation(summary = "Поиск пользователей по имени или username для добавления в друзья")
  public ApiResponse<PageResponse<UserProfileShortResponse>> searchUsers(
      @RequestParam(required = false) String query,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    return ApiResponse.of(profileService.searchUsers(query, page, size));
  }

  @PostMapping("/request/{friendId}")
  @Operation(summary = "Отправить запрос в друзья")
  public ApiResponseVoid sendFriendRequest(@PathVariable UUID friendId) {
    profileService.sendFriendRequest(friendId);
    return ApiResponse.empty();
  }

  @PostMapping("/accept/{friendshipId}")
  @Operation(summary = "Принять запрос в друзья")
  public ApiResponseVoid acceptFriendRequest(@PathVariable UUID friendshipId) {
    profileService.acceptFriendRequest(friendshipId);
    return ApiResponse.empty();
  }

  @PostMapping("/reject/{friendshipId}")
  @Operation(summary = "Отклонить запрос в друзья")
  public ApiResponseVoid rejectFriendRequest(@PathVariable UUID friendshipId) {
    profileService.rejectFriendRequest(friendshipId);
    return ApiResponse.empty();
  }

  @DeleteMapping("/{friendId}")
  @Operation(summary = "Удалить из друзей")
  public ApiResponseVoid removeFriend(@PathVariable UUID friendId) {
    profileService.removeFriend(friendId);
    return ApiResponse.empty();
  }

}

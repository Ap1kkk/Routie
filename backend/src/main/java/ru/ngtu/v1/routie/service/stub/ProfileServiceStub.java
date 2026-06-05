package ru.ngtu.v1.routie.service.stub;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
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

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@Profile("stub")
@Primary
public class ProfileServiceStub implements ProfileService {

    @Override
    public UserProfileFullResponse getCurrentUserProfile() {
        log.debug("[STUB] getCurrentUserProfile");
        return FakeDataFactory.fakeUserProfileFull();
    }

    @Override
    public UserProfileFullResponse updateCurrentUserProfile(ProfileUpdateRequest request) {
        log.debug("[STUB] updateCurrentUserProfile");
        UserProfileFullResponse profile = FakeDataFactory.fakeUserProfileFull();
        if (request.getName() != null) profile.setName(request.getName());
        if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) profile.setGender(request.getGender());
        return profile;
    }

    @Override
    public UserProfileFullResponse getUserProfile(UUID userId) {
        log.debug("[STUB] getUserProfile: {}", userId);
        UserProfileFullResponse profile = FakeDataFactory.fakeUserProfileFull();
        profile.setId(userId);
        return profile;
    }

    @Override
    public UserProfileShortResponse getShortUserProfile(UUID userId) {
        log.debug("[STUB] getShortUserProfile: {}", userId);
        UserProfileShortResponse profile = FakeDataFactory.fakeUserProfileShort();
        profile.setId(userId);
        return profile;
    }

    @Override
    public MediaFileResponse uploadAvatar(MultipartFile file) {
        log.debug("[STUB] uploadAvatar: {}", file.getOriginalFilename());
        return FakeDataFactory.fakeMediaFile();
    }

    @Override
    public PageResponse<UserProfileShortResponse> getFriends(
            int page, int size, String sort, String search, String status) {
        log.debug("[STUB] getFriends page={}, size={}", page, size);
        long total = 42L;
        List<UserProfileShortResponse> content = FakeDataFactory.fakeUserProfileShortList(size);
        return FakeDataFactory.fakePage(content, page, size, total);
    }

    @Override
    public void sendFriendRequest(UUID friendId) {
        log.debug("[STUB] sendFriendRequest: {}", friendId);
    }

    @Override
    public void acceptFriendRequest(UUID friendshipId) {
        log.debug("[STUB] acceptFriendRequest: {}", friendshipId);
    }

    @Override
    public void rejectFriendRequest(UUID friendshipId) {
        log.debug("[STUB] rejectFriendRequest: {}", friendshipId);
    }

    @Override
    public void removeFriend(UUID friendId) {
        log.debug("[STUB] removeFriend: {}", friendId);
    }

    @Override
    public PageResponse<RouteShortResponse> getFavorites(int page, int size) {
        log.debug("[STUB] getFavorites page={}, size={}", page, size);
        long total = 15L;
        List<RouteShortResponse> content = FakeDataFactory.fakeRouteShortList(Math.min(size, (int) total));
        return FakeDataFactory.fakePage(content, page, size, total);
    }
}

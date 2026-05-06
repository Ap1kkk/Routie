package ru.ngtu.twosteps.user;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.datafaker.Faker;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.twosteps.auth.AuthService;
import ru.ngtu.twosteps.jpa.entity.Category;
import ru.ngtu.twosteps.category.CategoryService;
import ru.ngtu.twosteps.jpa.repository.RegionRepository;
import ru.ngtu.twosteps.jpa.repository.HistoryRouteRepository;
import ru.ngtu.twosteps.common.exceptions.classes.data.EntityNotFoundException;
import ru.ngtu.twosteps.jpa.repository.user.UserRepository;
import ru.ngtu.twosteps.jpa.repository.user.UserAchievementRepository;
import ru.ngtu.twosteps.jpa.entity.user.UserAvatar;
import ru.ngtu.twosteps.jpa.repository.user.UserAvatarRepository;
import ru.ngtu.twosteps.user.dto.CreateCredentialsDto;
import ru.ngtu.twosteps.user.dto.EditProfileDto;
import ru.ngtu.twosteps.user.dto.FinishRegistrationDto;
import ru.ngtu.twosteps.user.dto.ProfileDto;
import ru.ngtu.twosteps.user.dto.UserProjectionDto;
import ru.ngtu.twosteps.user.mappers.UserMapper;
import ru.ngtu.twosteps.user.mappers.UserProjectionMapper;
import ru.ngtu.twosteps.jpa.entity.user.User;

/**
 * @author Egor Bokov
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository repository;
  private final UserValidator validator;
  private final UserMapper mapper;
  private final UserProjectionMapper projectionMapper;

  private final AuthService authService;
  private final CategoryService categoryService;

  private final Faker faker = new Faker();
  private final UserAvatarRepository userAvatarRepository;
  private final RegionRepository regionRepository;
  private final HistoryRouteRepository historyRouteRepository;
  private final UserAchievementRepository userAchievementRepository;

  public User getById(Long id) {
    return validator.throwIfNotExists(id);
  }

  @Transactional
  public UserProjectionDto create(CreateCredentialsDto dto) {
    log.debug("[User]: Create user for email: {}", dto.getEmail());

    validator.validateToCreate(dto);
    User user = mapper.map(dto);
    user.setAvatar(getRandomAvatar());

    return projectionMapper.toDto(repository.saveAndFlush(user));
  }

  @Transactional
  public UserProjectionDto choosePreferences(List<Long> preferencesIds) {
    User currentUser = authService.getCurrentUser();
    log.debug("[User]: user [{}] choosing preferences by ids: {}", currentUser.getId(),
        preferencesIds);

    validator.validatePreferencesIds(preferencesIds);

    List<Category> preferences = categoryService.getByIds(preferencesIds);
    currentUser.setPreferences(preferences);

    return projectionMapper.toDto(repository.saveAndFlush(currentUser));
  }

  @Transactional
  public UserProjectionDto editProfile(EditProfileDto dto) {
    User currentUser = authService.getCurrentUser();
    log.debug("[User]: user [{}] editing profile: {}", currentUser.getId(), dto);

    validator.validateEditProfile(dto);

    Long avatarId = dto.getAvatarId();
    UserAvatar userAvatar = userAvatarRepository.findById(avatarId)
        .orElseThrow(() -> new EntityNotFoundException(UserAvatar.class, avatarId));
    currentUser.setAvatar(userAvatar);
    List<Category> preferences = categoryService.getByIds(dto.getPreferencesIds());
    currentUser.setPreferences(preferences);

    return projectionMapper.toDto(repository.save(currentUser));
  }

  @Transactional
  public ProfileDto getProfile() {
    User currentUser = authService.getCurrentUser();
    Long totalDistance = historyRouteRepository.getTotalDistance(currentUser.getId());
    Long totalAchievements = userAchievementRepository.countByUserId(currentUser.getId());

    return ProfileDto
        .builder()
        .totalDistance(totalDistance == null ? 0L : (long) (totalDistance / 0.75)) // Шаги
        .totalAchievements(totalAchievements == null ? 0L : totalAchievements)
        .user(projectionMapper.toDto(currentUser))
        .build();
  }

  private UserAvatar getRandomAvatar() {
    List<Long> allIds = userAvatarRepository.findAllIds();

    Long id = allIds.getFirst();
    return userAvatarRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException(UserAvatar.class, id));
  }

  public UserProjectionDto finishRegistration(FinishRegistrationDto dto) {
    User currentUser = authService.getCurrentUser();
    validator.validateFinishRegistration(dto);

    User updatedUser = mapper.map(currentUser, dto);
    return projectionMapper.toDto(repository.save(currentUser));
  }
}

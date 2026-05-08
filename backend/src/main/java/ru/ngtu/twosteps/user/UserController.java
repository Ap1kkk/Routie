package ru.ngtu.twosteps.user;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.ngtu.twosteps.user.dto.CreateCredentialsDto;
import ru.ngtu.twosteps.user.dto.EditProfileDto;
import ru.ngtu.twosteps.user.dto.FinishRegistrationDto;
import ru.ngtu.twosteps.user.dto.ProfileDto;
import ru.ngtu.twosteps.user.dto.UserProjectionDto;
import ru.ngtu.twosteps.jpa.entity.user.User;

/**
 * @author Egor Bokov
 */
@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@Tag(name = "User", description = "User endpoints")
public class UserController {

  private final UserService userService;

  @GetMapping
  public User getById(@RequestParam Long id) {
    return userService.getById(id);
  }

  @GetMapping("/profile")
  public ProfileDto getProfile() {
    return userService.getProfile();
  }

  @PostMapping("/create")
  public UserProjectionDto create(@RequestBody CreateCredentialsDto dto) {
    return userService.create(dto);
  }

  @PostMapping("/finish-registration")
  public UserProjectionDto finishRegistration(@RequestBody FinishRegistrationDto dto) {
    return userService.finishRegistration(dto);
  }

  @PostMapping("/choose-preferences")
  public UserProjectionDto choosePreferences(@RequestBody List<Long> preferencesIds) {
    return userService.choosePreferences(preferencesIds);
  }

  @PostMapping("/edit")
  public UserProjectionDto edit(@RequestBody EditProfileDto dto) {
    return userService.editProfile(dto);
  }
}

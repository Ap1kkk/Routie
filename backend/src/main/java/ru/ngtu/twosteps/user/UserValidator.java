package ru.ngtu.twosteps.user;

import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.util.Strings;
import org.springframework.stereotype.Component;
import ru.ngtu.twosteps.common.exceptions.classes.data.EntityNotFoundException;
import ru.ngtu.twosteps.common.exceptions.classes.validation.DefaultValidationErrorType;
import ru.ngtu.twosteps.common.exceptions.classes.validation.ValidationException;
import ru.ngtu.twosteps.common.exceptions.classes.validation.ValidationViolationDto;
import ru.ngtu.twosteps.jpa.repository.user.UserRepository;
import ru.ngtu.twosteps.user.dto.CreateCredentialsDto;
import ru.ngtu.twosteps.user.dto.EditProfileDto;
import ru.ngtu.twosteps.user.dto.FinishRegistrationDto;
import ru.ngtu.twosteps.jpa.entity.user.User;

import java.util.List;
import java.util.Optional;

import static ru.ngtu.twosteps.common.exceptions.classes.validation.ValidationViolationDto.requiredIsNull;

/**
 * @author Egor Bokov
 */
@Component
@RequiredArgsConstructor
public class UserValidator {

    private static final String CREATE_ERROR_MESSAGE = "Create credentials validation failed";
    private static final String PREFERENCES_IDS_ERROR_MESSAGE = "User preferences ids validation failed";
    private static final String EDIT_PROFILE_ERROR_MESSAGE = "Edit profile dto validation failed";
    private static final String FINISH_REGISTRATION_ERROR_MESSAGE = "Finish registration dto validation failed";

    private final UserRepository repository;

    public User throwIfNotExists(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(User.class, id));
    }

    public void validateToCreate(CreateCredentialsDto dto) {
        ValidationException.Builder exceptionBuilder = ValidationException.builder().message(CREATE_ERROR_MESSAGE);

        if(dto == null) {
            exceptionBuilder.addViolation(requiredIsNull("dto", "Dto"));
            throw exceptionBuilder.build();
        }

        if(Strings.isBlank(dto.getUsername()))
            exceptionBuilder.addViolation(requiredIsNull("username", "Username"));
        String userEmail = dto.getEmail();
        if(Strings.isBlank(userEmail))
            exceptionBuilder.addViolation(requiredIsNull("email", "Email"));
        else {
            Optional<User> byEmail = repository.findByEmail(userEmail);
            if(byEmail.isPresent())
                exceptionBuilder.addViolation(ValidationViolationDto
                        .builder()
                                .field("email")
                                .message("Email is not unique")
                                .value(userEmail)
                                .errorType(DefaultValidationErrorType.UNIQUE_VIOLATION)
                        .build()
                );
        }
        if(Strings.isBlank(dto.getPassword()))
            exceptionBuilder.addViolation(requiredIsNull("password", "Password"));

        if(dto.getRole() == null)
            exceptionBuilder.addViolation(requiredIsNull("role", "Role"));

        if(exceptionBuilder.hasViolations())
            throw exceptionBuilder.build();
    }

    public void validatePreferencesIds(List<Long> preferencesIds) {
        ValidationException.Builder exceptionBuilder = ValidationException.builder().message(PREFERENCES_IDS_ERROR_MESSAGE);
        validatePreferencesIds(preferencesIds, exceptionBuilder);

        if(exceptionBuilder.hasViolations())
            throw exceptionBuilder.build();
    }

    public void validatePreferencesIds(List<Long> preferencesIds, ValidationException.Builder exceptionBuilder) {
        if(preferencesIds == null || preferencesIds.isEmpty()) {
            exceptionBuilder.addViolation(requiredIsNull("preferencesIds", "User preferences ids"));
        }
    }

    public void validateEditProfile(EditProfileDto dto) {
        ValidationException.Builder exceptionBuilder = ValidationException.builder().message(EDIT_PROFILE_ERROR_MESSAGE);

        if(dto == null) {
            exceptionBuilder.addViolation(requiredIsNull("dto", "Dto"));
            throw exceptionBuilder.build();
        }

        if(dto.getAvatarId() == null)
            exceptionBuilder.addViolation(requiredIsNull("avatarId", "Avatar id"));

        validatePreferencesIds(dto.getPreferencesIds(), exceptionBuilder);

        if(exceptionBuilder.hasViolations())
            throw exceptionBuilder.build();
    }

    public void validateFinishRegistration(FinishRegistrationDto dto) {
        ValidationException.Builder exceptionBuilder = ValidationException.builder().message(FINISH_REGISTRATION_ERROR_MESSAGE);

        if(dto == null) {
            exceptionBuilder.addViolation(requiredIsNull("dto", "Dto"));
            throw exceptionBuilder.build();
        }

        if(dto.getBirthday() == null)
            exceptionBuilder.addViolation(requiredIsNull("birthday", "Birthday"));
        if(dto.getGender() == null)
            exceptionBuilder.addViolation(requiredIsNull("gender", "Gender"));
        if(dto.getRegionId() == null)
            exceptionBuilder.addViolation(requiredIsNull("regionId", "Region id"));
        if(dto.getActivityId() == null)
            exceptionBuilder.addViolation(requiredIsNull("activityId", "Activity id"));

        if(exceptionBuilder.hasViolations())
            throw exceptionBuilder.build();
    }
}

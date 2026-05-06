package ru.ngtu.twosteps.routes;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import ru.ngtu.twosteps.jpa.repository.RouteRepository;
import ru.ngtu.twosteps.jpa.entity.route.Route;
import ru.ngtu.twosteps.common.exceptions.classes.data.EntityNotFoundException;

/**
 * @author Egor Bokov
 */
@Component
@RequiredArgsConstructor
public class RouteValidator {

    private final RouteRepository repository;

    public Route throwIfNotExist(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Route.class, id));
    }
}

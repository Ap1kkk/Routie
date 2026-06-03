package ru.ngtu.v1.routie.exception;

import org.springframework.http.HttpStatus;

public class EntityNotFoundException extends AppException {

    public EntityNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "ENTITY_NOT_FOUND", message);
    }

    public EntityNotFoundException(String entity, Object id) {
        super(HttpStatus.NOT_FOUND, "ENTITY_NOT_FOUND", entity + " с id=" + id + " не найден");
    }
}

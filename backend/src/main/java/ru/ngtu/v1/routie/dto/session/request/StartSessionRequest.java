package ru.ngtu.v1.routie.dto.session.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class StartSessionRequest {

    @NotNull
    private UUID routeId;
}

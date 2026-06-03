package ru.ngtu.v1.routie.dto.gamification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class XpTransactionResponse {

    private UUID id;
    private Integer amount;
    private String reason;
    private UUID referenceId;
    private String referenceType;
    private Instant createdAt;
}

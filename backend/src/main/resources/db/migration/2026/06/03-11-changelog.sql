-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-08-06-session-checkpoint-progress
CREATE TABLE session_checkpoint_progress
(
    id            UUID             NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id    UUID             NOT NULL REFERENCES route_sessions (id) ON DELETE CASCADE,
    checkpoint_id UUID             NOT NULL REFERENCES route_checkpoints (id) ON DELETE CASCADE,
    reached_at    TIMESTAMPTZ      NOT NULL DEFAULT now(),
    avg_speed_kmh DOUBLE PRECISION,
    CONSTRAINT uq_session_checkpoint UNIQUE (session_id, checkpoint_id)
);

CREATE INDEX idx_session_checkpoint_progress_session ON session_checkpoint_progress (session_id);

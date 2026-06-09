-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-08-05-route-sessions
CREATE TABLE route_sessions
(
    id                    UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id               UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    route_id              UUID        NOT NULL REFERENCES routes (id) ON DELETE CASCADE,
    status                VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    started_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at           TIMESTAMPTZ,
    total_duration_seconds BIGINT,
    total_distance_meters  INTEGER,
    avg_speed_kmh          DOUBLE PRECISION
);

CREATE INDEX idx_route_sessions_user ON route_sessions (user_id);
CREATE INDEX idx_route_sessions_route ON route_sessions (route_id);
CREATE INDEX idx_route_sessions_user_status ON route_sessions (user_id, status);

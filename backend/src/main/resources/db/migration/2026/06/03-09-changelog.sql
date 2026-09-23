-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-08-01-routes
CREATE TABLE routes
(
    id                      UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title                   VARCHAR(255) NOT NULL,
    description             TEXT,
    type                    VARCHAR(20)  NOT NULL,
    difficulty              INTEGER      NOT NULL,
    length_meters           INTEGER      NOT NULL,
    estimated_time_minutes  INTEGER      NOT NULL,
    city                    VARCHAR(255),
    completions_count       INTEGER      NOT NULL DEFAULT 0,
    is_active               BOOLEAN      NOT NULL DEFAULT false,
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_routes_title ON routes (LOWER(title));
CREATE INDEX idx_routes_type ON routes (type);
CREATE INDEX idx_routes_active ON routes (is_active);

-- changeset Ap1kkk:2026-06-08-02-route-tags-fk
ALTER TABLE route_tags
    ADD CONSTRAINT fk_route_tags_route
        FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE CASCADE;

-- changeset Ap1kkk:2026-06-08-03-route-checkpoints
CREATE TABLE route_checkpoints
(
    id          UUID             NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    route_id    UUID             NOT NULL REFERENCES routes (id) ON DELETE CASCADE,
    latitude    DOUBLE PRECISION NOT NULL,
    longitude   DOUBLE PRECISION NOT NULL,
    sort_order  INTEGER          NOT NULL,
    landmark_id UUID REFERENCES landmarks (id) ON DELETE SET NULL
);

CREATE INDEX idx_route_checkpoints_route ON route_checkpoints (route_id);

-- changeset Ap1kkk:2026-06-08-04-route-images
CREATE TABLE route_images
(
    route_id   UUID    NOT NULL REFERENCES routes (id) ON DELETE CASCADE,
    file_id    UUID    NOT NULL REFERENCES media_files (id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (route_id, file_id)
);

CREATE INDEX idx_route_images_file ON route_images (file_id);

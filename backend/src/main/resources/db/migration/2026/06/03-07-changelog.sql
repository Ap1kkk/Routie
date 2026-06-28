-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-03-13-audio-guides
CREATE TABLE audio_guides
(
    id               UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    duration_seconds INTEGER,
    file_id          UUID REFERENCES media_files (id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_audio_guides_title ON audio_guides (LOWER(title));

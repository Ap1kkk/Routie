-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-06-01-landmarks
CREATE TABLE landmarks
(
    id             UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title          VARCHAR(255) NOT NULL,
    description    TEXT,
    audio_guide_id UUID REFERENCES audio_guides (id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_landmarks_title ON landmarks (LOWER(title));

-- changeset Ap1kkk:2026-06-06-02-landmark-images
CREATE TABLE landmark_images
(
    landmark_id UUID    NOT NULL REFERENCES landmarks (id) ON DELETE CASCADE,
    file_id     UUID    NOT NULL REFERENCES media_files (id) ON DELETE CASCADE,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (landmark_id, file_id)
);

CREATE INDEX idx_landmark_images_file ON landmark_images (file_id);

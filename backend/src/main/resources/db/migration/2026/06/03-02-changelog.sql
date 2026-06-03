-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-03-03-media-files
CREATE TABLE media_files
(
    id                UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename   VARCHAR(255) NOT NULL UNIQUE,
    content_type      VARCHAR(100) NOT NULL,
    size_bytes        BIGINT       NOT NULL,
    sort_order        INTEGER      NOT NULL DEFAULT 0,
    uploaded_by       UUID         NOT NULL REFERENCES routie_users (id) ON DELETE CASCADE,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_files_uploaded_by ON media_files (uploaded_by);

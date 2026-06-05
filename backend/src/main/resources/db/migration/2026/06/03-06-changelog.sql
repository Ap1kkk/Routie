-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-03-12-user-profiles-refactor
ALTER TABLE user_profiles
    DROP COLUMN IF EXISTS city,
    DROP COLUMN IF EXISTS preferred_transport,
    DROP COLUMN IF EXISTS favorite_sport_type,
    ADD COLUMN IF NOT EXISTS height  INTEGER,
    ADD COLUMN IF NOT EXISTS weight  INTEGER;

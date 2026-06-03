-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-03-01-users
CREATE TABLE routie_users
(
    id            UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    username      VARCHAR(30)  NOT NULL UNIQUE,
    name          VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'USER',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- changeset Ap1kkk:2026-06-03-02-refresh-tokens
CREATE TABLE refresh_tokens
(
    id         UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    user_id    UUID        NOT NULL REFERENCES routie_users (id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);

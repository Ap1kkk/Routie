-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-09-05-password-reset-codes
-- comment: Таблица одноразовых OTP-кодов для сброса пароля

CREATE TABLE password_reset_codes
(
    id         UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    UUID        NOT NULL REFERENCES routie_users (id) ON DELETE CASCADE,
    code_hash  VARCHAR(64) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_password_reset_codes_user_id ON password_reset_codes (user_id);

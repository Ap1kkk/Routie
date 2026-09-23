-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-09-03-refresh-tokens-device
-- comment: Добавляем device_id, device_name, last_used_at в refresh_tokens; уникальность (user_id, device_id)

ALTER TABLE refresh_tokens
    ADD COLUMN device_id   VARCHAR(255) NOT NULL DEFAULT gen_random_uuid()::text,
    ADD COLUMN device_name VARCHAR(255),
    ADD COLUMN last_used_at TIMESTAMPTZ  NOT NULL DEFAULT now();

-- Один токен на пару (пользователь, устройство)
ALTER TABLE refresh_tokens
    ADD CONSTRAINT uq_refresh_tokens_user_device UNIQUE (user_id, device_id);

-- Быстрый поиск истёкших токенов при плановой очистке
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens (expires_at);

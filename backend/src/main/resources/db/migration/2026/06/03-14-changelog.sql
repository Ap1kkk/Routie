-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-09-04-rename-refresh-tokens
-- comment: Переименование refresh_tokens → auth_sessions. Таблица хранит по одной активной сессии на устройство пользователя.

ALTER TABLE refresh_tokens RENAME TO auth_sessions;

-- Обновляем имена ограничений и индексов в соответствии с новым именем таблицы
ALTER INDEX idx_refresh_tokens_user_id     RENAME TO idx_auth_sessions_user_id;
ALTER INDEX idx_refresh_tokens_expires_at  RENAME TO idx_auth_sessions_expires_at;

ALTER TABLE auth_sessions
    RENAME CONSTRAINT uq_refresh_tokens_user_device TO uq_auth_sessions_user_device;

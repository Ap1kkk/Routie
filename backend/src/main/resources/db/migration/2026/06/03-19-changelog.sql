-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-23-05-notifications
-- comment: In-app уведомления (достижения, начисление XP), доставляются также через WebSocket

CREATE TABLE notifications
(
    id         UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    UUID         NOT NULL REFERENCES routie_users (id) ON DELETE CASCADE,
    type       VARCHAR(30)  NOT NULL,
    title      VARCHAR(255) NOT NULL,
    body       TEXT,
    payload    TEXT,
    is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_user_unread ON notifications (user_id, is_read);

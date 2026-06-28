-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-23-02-xp-transactions
-- comment: Журнал начислений XP — нужен для расчёта periodXp в лидербордах и истории начислений

CREATE TABLE xp_transactions
(
    id           UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id      UUID         NOT NULL REFERENCES routie_users (id) ON DELETE CASCADE,
    amount       INTEGER      NOT NULL,
    reason       VARCHAR(50)  NOT NULL,
    reference_id UUID,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_xp_transactions_user_id ON xp_transactions (user_id);
CREATE INDEX idx_xp_transactions_created_at ON xp_transactions (created_at);
CREATE INDEX idx_xp_transactions_user_created ON xp_transactions (user_id, created_at);

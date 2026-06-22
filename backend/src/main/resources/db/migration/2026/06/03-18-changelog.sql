-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-23-03-achievements
-- comment: Каталог достижений (фиксированный список, задаётся миграцией) + журнал разблокировок

CREATE TABLE achievements
(
    id            UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    description   TEXT,
    icon_file_id  UUID,
    xp_reward     INTEGER      NOT NULL,
    metric        VARCHAR(30)  NOT NULL,
    target_value  INTEGER      NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE user_achievements
(
    user_id        UUID        NOT NULL REFERENCES routie_users (id) ON DELETE CASCADE,
    achievement_id UUID        NOT NULL REFERENCES achievements (id) ON DELETE CASCADE,
    unlocked_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user_id ON user_achievements (user_id);

-- changeset Ap1kkk:2026-06-23-04-achievements-seed
-- comment: Фиксированный список из 10 достижений по трём метрикам (маршруты, дистанция, ландмарки) и уровню

INSERT INTO achievements (id, title, description, xp_reward, metric, target_value)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'Первые шаги', 'Завершите свой первый маршрут', 50, 'ROUTES_COMPLETED', 1),
    ('10000000-0000-0000-0000-000000000002', 'Любитель прогулок', 'Завершите 10 маршрутов', 200, 'ROUTES_COMPLETED', 10),
    ('10000000-0000-0000-0000-000000000003', 'Марафонец', 'Завершите 50 маршрутов', 1000, 'ROUTES_COMPLETED', 50),
    ('10000000-0000-0000-0000-000000000004', 'Покоритель километров', 'Пройдите 10 000 метров', 150, 'DISTANCE_METERS', 10000),
    ('10000000-0000-0000-0000-000000000005', 'Путешественник', 'Пройдите 50 000 метров', 500, 'DISTANCE_METERS', 50000),
    ('10000000-0000-0000-0000-000000000006', 'Исследователь', 'Пройдите 100 000 метров', 1000, 'DISTANCE_METERS', 100000),
    ('10000000-0000-0000-0000-000000000007', 'Коллекционер', 'Посетите 10 достопримечательностей', 200, 'LANDMARKS_VISITED', 10),
    ('10000000-0000-0000-0000-000000000008', 'Знаток города', 'Посетите 50 достопримечательностей', 800, 'LANDMARKS_VISITED', 50),
    ('10000000-0000-0000-0000-000000000009', 'Опытный игрок', 'Достигните 5 уровня', 300, 'LEVEL', 5),
    ('10000000-0000-0000-0000-000000000010', 'Мастер маршрутов', 'Достигните 10 уровня', 1000, 'LEVEL', 10)
ON CONFLICT (id) DO NOTHING;

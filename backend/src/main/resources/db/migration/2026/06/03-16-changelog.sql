-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-23-01-favorite-routes-fk
-- comment: На момент создания user_favorite_routes таблицы routes ещё не существовало. Добавляем FK теперь.

ALTER TABLE user_favorite_routes
    ADD CONSTRAINT fk_user_favorite_routes_route FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE CASCADE;

CREATE INDEX idx_user_favorite_routes_route_id ON user_favorite_routes (route_id);

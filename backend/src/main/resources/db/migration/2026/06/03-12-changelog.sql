-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-09-01-test-users context:test
-- comment: Тестовые пользователи для разработки. Вставляются только при Liquibase context=test (профиль Spring: test).

INSERT INTO routie_users (id, email, username, password_hash, role)
VALUES
    -- Пароль: test-user (bcrypt, заглушка — вход через тестовый токен)
    ('00000000-0000-0000-0000-000000000001',
     'test-user@routie.local',
     'test_user',
     '$2a$12$dummyhashforTestUserXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
     'USER'),

    -- Пароль: test-admin (bcrypt, заглушка — вход через тестовый токен)
    ('00000000-0000-0000-0000-000000000002',
     'test-admin@routie.local',
     'test_admin',
     '$2a$12$dummyhashforTestAdminXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
     'ADMIN')
ON CONFLICT (id) DO NOTHING;

-- changeset Ap1kkk:2026-06-09-02-test-user-profiles context:test
INSERT INTO user_profiles (user_id, name)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Test User'),
    ('00000000-0000-0000-0000-000000000002', 'Test Admin')
ON CONFLICT (user_id) DO NOTHING;

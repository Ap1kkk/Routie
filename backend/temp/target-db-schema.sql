-- =============================================
-- База данных для спортивно-туристического приложения (MVP Монолит)
-- Используем UUID для всех id
-- =============================================

-- Включаем расширение для генерации UUID
CREATE
EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1. МЕДИАФАЙЛЫ (MinIO метаданные)
-- =============================================
CREATE TABLE media_files
(
    id            UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    minio_id      VARCHAR(255) NOT NULL UNIQUE,
    original_name VARCHAR(255) NOT NULL,
    file_type     VARCHAR(50)  NOT NULL,
    file_size     BIGINT,
    uploaded_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted    BOOLEAN                  DEFAULT false
);

-- =============================================
-- 2. ПОЛЬЗОВАТЕЛИ
-- =============================================
CREATE TABLE users
(
    id              UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255),
    vk_id           BIGINT UNIQUE,
    is_active       BOOLEAN                  DEFAULT true,
    is_deleted      BOOLEAN                  DEFAULT false,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles
(
    user_id                 UUID PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    first_name              VARCHAR(100),
    last_name               VARCHAR(100),
    avatar_media_id         UUID REFERENCES media_files (id),
    date_of_birth           DATE,
    gender                  VARCHAR(20),
    city                    VARCHAR(100),
    total_xp                BIGINT                   DEFAULT 0,
    current_level           INT                      DEFAULT 1,
    bio                     TEXT,
    favorite_sport_type     VARCHAR(100),
    preferred_transport     VARCHAR(50),
    total_distance_meters   BIGINT                   DEFAULT 0,
    total_routes_completed  INT                      DEFAULT 0,
    total_landmarks_visited INT                      DEFAULT 0,
    updated_at              TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles
(
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    role    VARCHAR(50) NOT NULL, -- 'USER', 'ADMIN'
    PRIMARY KEY (user_id, role)
);

-- =============================================
-- 3. ДРУЗЬЯ
-- =============================================
CREATE TABLE friendships
(
    id         UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    user_id    UUID REFERENCES users (id) ON DELETE CASCADE,
    friend_id  UUID REFERENCES users (id) ON DELETE CASCADE,
    status     VARCHAR(20) NOT NULL     DEFAULT 'PENDING', -- PENDING, ACCEPTED, REJECTED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN                  DEFAULT false,
    UNIQUE (user_id, friend_id)
);

-- =============================================
-- 4. ТЕГИ
-- =============================================
CREATE TABLE tags
(
    id         UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    name       VARCHAR(100) NOT NULL UNIQUE,
    category   VARCHAR(50),
    is_deleted BOOLEAN                  DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE route_tags
(
    route_id UUID REFERENCES routes (id) ON DELETE CASCADE,
    tag_id   UUID REFERENCES tags (id) ON DELETE CASCADE,
    PRIMARY KEY (route_id, tag_id)
);

CREATE TABLE user_tag_preferences
(
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    tag_id  UUID REFERENCES tags (id) ON DELETE CASCADE,
    weight  INT DEFAULT 1 CHECK (weight BETWEEN 1 AND 5),
    PRIMARY KEY (user_id, tag_id)
);

-- =============================================
-- 5. МАРШРУТЫ И ДОСТОПРИМЕЧАТЕЛЬНОСТИ
-- =============================================
CREATE TABLE routes
(
    id                     UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    title                  VARCHAR(255) NOT NULL,
    description            TEXT,
    type                   VARCHAR(50)  NOT NULL, -- SPORT, TOURIST, MIXED
    difficulty             INT          NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
    length_meters          INT          NOT NULL,
    estimated_time_minutes INT          NOT NULL,
    created_by             UUID REFERENCES users (id),
    is_active              BOOLEAN                  DEFAULT true,
    is_deleted             BOOLEAN                  DEFAULT false,
    created_at             TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE route_checkpoints
(
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id    UUID REFERENCES routes (id) ON DELETE CASCADE,
    latitude    DECIMAL(10, 8) NOT NULL,
    longitude   DECIMAL(11, 8) NOT NULL,
    title       VARCHAR(150),
    description TEXT,
    sort_order  INT            NOT NULL,
    landmark_id UUID REFERENCES landmarks (id),
    is_deleted  BOOLEAN          DEFAULT false
);

-- =============================================
-- 6. АУДИОГИДЫ И ДОСТОПРИМЕЧАТЕЛЬНОСТИ
-- =============================================
CREATE TABLE audio_guides
(
    id               UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    title            VARCHAR(255)                     NOT NULL,
    media_file_id    UUID REFERENCES media_files (id) NOT NULL,
    duration_seconds INT,
    created_by       UUID REFERENCES users (id),
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted       BOOLEAN                  DEFAULT false
);

CREATE TABLE landmarks
(
    id             UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    name           VARCHAR(255) NOT NULL,
    description    TEXT,
    audio_guide_id UUID REFERENCES audio_guides (id),
    created_by     UUID REFERENCES users (id),
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted     BOOLEAN                  DEFAULT false
);

CREATE TABLE landmark_photos
(
    landmark_id   UUID REFERENCES landmarks (id) ON DELETE CASCADE,
    media_file_id UUID REFERENCES media_files (id),
    sort_order    INT DEFAULT 0,
    PRIMARY KEY (landmark_id, media_file_id)
);

-- =============================================
-- 7. ИЗБРАННОЕ
-- =============================================
CREATE TABLE user_favorites
(
    user_id  UUID REFERENCES users (id) ON DELETE CASCADE,
    route_id UUID REFERENCES routes (id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, route_id)
);

-- =============================================
-- 8. ПРОХОЖДЕНИЕ МАРШРУТОВ
-- =============================================
CREATE TABLE user_route_sessions
(
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users (id) ON DELETE CASCADE,
    route_id        UUID REFERENCES routes (id) ON DELETE CASCADE,
    started_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at    TIMESTAMP WITH TIME ZONE,
    status          VARCHAR(30)      DEFAULT 'IN_PROGRESS', -- IN_PROGRESS, COMPLETED, ABANDONED
    total_xp_earned INT              DEFAULT 0,
    is_deleted      BOOLEAN          DEFAULT false
);

CREATE TABLE user_checkpoint_completions
(
    session_id    UUID REFERENCES user_route_sessions (id) ON DELETE CASCADE,
    checkpoint_id UUID REFERENCES route_checkpoints (id) ON DELETE CASCADE,
    completed_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (session_id, checkpoint_id)
);

-- =============================================
-- 9. ГЕЙМИФИКАЦИЯ
-- =============================================
CREATE TABLE xp_coefficients
(
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factor_name VARCHAR(100)   NOT NULL UNIQUE,
    value       DECIMAL(10, 4) NOT NULL,
    description TEXT
);

CREATE TABLE achievements
(
    id            UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    title         VARCHAR(150) NOT NULL,
    description   TEXT         NOT NULL,
    icon_media_id UUID REFERENCES media_files (id),
    xp_reward     INT                      DEFAULT 0,
    is_secret     BOOLEAN                  DEFAULT false,
    is_deleted    BOOLEAN                  DEFAULT false,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_achievements
(
    user_id        UUID REFERENCES users (id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements (id) ON DELETE CASCADE,
    progress       INT     DEFAULT 0,
    target_value   INT NOT NULL,
    is_unlocked    BOOLEAN DEFAULT false,
    unlocked_at    TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, achievement_id)
);

CREATE TABLE user_xp_transactions
(
    id             UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    user_id        UUID REFERENCES users (id) ON DELETE CASCADE,
    amount         INT          NOT NULL,
    reason         VARCHAR(100) NOT NULL,
    reference_id   UUID,
    reference_type VARCHAR(50),
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
-- =============================================

-- Пользователи
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_vk_id ON users (vk_id);
CREATE INDEX idx_user_profiles_city ON user_profiles (city);

-- Друзья
CREATE INDEX idx_friendships_user_id ON friendships (user_id);
CREATE INDEX idx_friendships_friend_id ON friendships (friend_id);
CREATE INDEX idx_friendships_status ON friendships (status);

-- Маршруты
CREATE INDEX idx_routes_type ON routes (type);
CREATE INDEX idx_routes_difficulty ON routes (difficulty);
CREATE INDEX idx_routes_created_by ON routes (created_by);
CREATE INDEX idx_route_checkpoints_route_id ON route_checkpoints (route_id);

-- Прохождения
CREATE INDEX idx_user_route_sessions_user_id ON user_route_sessions (user_id);
CREATE INDEX idx_user_route_sessions_route_id ON user_route_sessions (route_id);
CREATE INDEX idx_user_route_sessions_status ON user_route_sessions (status);
CREATE INDEX idx_user_checkpoint_completions_session_id ON user_checkpoint_completions (session_id);

-- Геймификация
CREATE INDEX idx_user_achievements_user_id ON user_achievements (user_id);
CREATE INDEX idx_user_achievements_unlocked ON user_achievements (is_unlocked);
CREATE INDEX idx_user_xp_transactions_user_id ON user_xp_transactions (user_id);
CREATE INDEX idx_user_xp_transactions_created_at ON user_xp_transactions (created_at);

-- Теги
CREATE INDEX idx_user_tag_preferences_user_id ON user_tag_preferences (user_id);

-- Soft delete
CREATE INDEX idx_media_files_is_deleted ON media_files (is_deleted);
CREATE INDEX idx_routes_is_deleted ON routes (is_deleted);
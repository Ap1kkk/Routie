-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-03-04-user-profiles
CREATE TABLE user_profiles
(
    user_id                 UUID        NOT NULL PRIMARY KEY REFERENCES routie_users (id) ON DELETE CASCADE,
    name                    VARCHAR(255),
    city                    VARCHAR(100),
    date_of_birth           DATE,
    gender                  VARCHAR(10),
    favorite_sport_type     VARCHAR(30),
    preferred_transport     VARCHAR(30),
    avatar_file_id          UUID        REFERENCES media_files (id) ON DELETE SET NULL,
    total_xp                INTEGER     NOT NULL DEFAULT 0,
    current_level           INTEGER     NOT NULL DEFAULT 1,
    total_distance_meters   INTEGER     NOT NULL DEFAULT 0,
    total_routes_completed  INTEGER     NOT NULL DEFAULT 0,
    total_landmarks_visited INTEGER     NOT NULL DEFAULT 0,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- changeset Ap1kkk:2026-06-03-05-user-preferred-tags
CREATE TABLE user_preferred_tags
(
    user_id UUID NOT NULL REFERENCES routie_users (id) ON DELETE CASCADE,
    tag_id  UUID NOT NULL,
    PRIMARY KEY (user_id, tag_id)
);

-- changeset Ap1kkk:2026-06-03-06-friendships
CREATE TABLE friendships
(
    id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id UUID        NOT NULL REFERENCES routie_users (id) ON DELETE CASCADE,
    addressee_id UUID        NOT NULL REFERENCES routie_users (id) ON DELETE CASCADE,
    status       VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_friendship UNIQUE (requester_id, addressee_id)
);

CREATE INDEX idx_friendships_requester ON friendships (requester_id);
CREATE INDEX idx_friendships_addressee ON friendships (addressee_id);
CREATE INDEX idx_friendships_status ON friendships (status);

-- changeset Ap1kkk:2026-06-03-07-user-favorite-routes
CREATE TABLE user_favorite_routes
(
    user_id    UUID        NOT NULL REFERENCES routie_users (id) ON DELETE CASCADE,
    route_id   UUID        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, route_id)
);

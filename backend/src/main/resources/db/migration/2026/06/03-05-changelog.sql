-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-03-08-tags
CREATE TABLE tags
(
    id         UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title      VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT uq_tag_title UNIQUE (title)
);

-- changeset Ap1kkk:2026-06-03-09-user-preferred-tags-fk
ALTER TABLE user_preferred_tags
    ADD CONSTRAINT fk_user_preferred_tags_tag
        FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE;

-- changeset Ap1kkk:2026-06-03-10-route-tags
CREATE TABLE route_tags
(
    route_id UUID NOT NULL,
    tag_id   UUID NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
    PRIMARY KEY (route_id, tag_id)
);

CREATE INDEX idx_route_tags_tag ON route_tags (tag_id);

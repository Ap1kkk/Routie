-- liquibase formatted sql

-- changeset Ap1kkk:2026-06-03-04-delete-name-from-user

AlTER TABLE routie_users
    DROP COLUMN name;
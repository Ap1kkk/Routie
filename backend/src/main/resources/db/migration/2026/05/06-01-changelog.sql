--liquibase formatted sql

--changeset EBokov:06-01-add-image-info

create table image_info
(
    id           uuid primary key default gen_random_uuid(),
    filename     varchar(255),
    content_type varchar(255),
    create_ts    timestamptz,
    deleted      boolean
);
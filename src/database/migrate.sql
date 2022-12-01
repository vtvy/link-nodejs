create database link;
use link;

CREATE TABLE `users` (
    `id` int(10) AUTO_INCREMENT NOT NULL ,
    `name` varchar(50)  NOT NULL ,
    `avatar` varchar(100) NULL ,
    `username` varchar(20)  NOT NULL UNIQUE ,
    `passwd` varchar(100)  NOT NULL ,
    `role` boolean  DEFAULT FALSE ,
    `createAt` dateTime  DEFAULT CURRENT_TIMESTAMP ,
    `updateAt` dateTime  ON UPDATE CURRENT_TIMESTAMP ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `images` (
    `id` int AUTO_INCREMENT NOT NULL ,
    `name` varchar(50)  NOT NULL ,
    `author` int(10)  NOT NULL ,
    `createAt` dateTime  DEFAULT CURRENT_TIMESTAMP ,
    `updateAt` dateTime  ON UPDATE CURRENT_TIMESTAMP ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `links` (
    `id` int AUTO_INCREMENT NOT NULL ,
    `name` varchar(50)  NOT NULL ,
    `public` boolean  DEFAULT FALSE ,
    `passwd` varchar(100)  NOT NULL ,
    `color` varchar(6)  NOT NULL ,
    `url` varchar(100)  NOT NULL ,
    `author` int(10)  NOT NULL ,
    `createAt` dateTime  DEFAULT CURRENT_TIMESTAMP ,
    `updateAt` dateTime  ON UPDATE CURRENT_TIMESTAMP ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `notes` (
    `id` int AUTO_INCREMENT NOT NULL ,
    `name` varchar(50)  NOT NULL ,
    `content` text  NOT NULL ,
    `author` int(10)  NOT NULL ,
    `createAt` dateTime  DEFAULT CURRENT_TIMESTAMP ,
    `updateAt` dateTime  ON UPDATE CURRENT_TIMESTAMP ,
    PRIMARY KEY (
        `id`
    )
);

ALTER TABLE `images` ADD CONSTRAINT `fk_images_author` FOREIGN KEY(`author`)
REFERENCES `users` (`id`);

ALTER TABLE `links` ADD CONSTRAINT `fk_links_author` FOREIGN KEY(`author`)
REFERENCES `users` (`id`);

ALTER TABLE `notes` ADD CONSTRAINT `fk_notes_author` FOREIGN KEY(`author`)
REFERENCES `users` (`id`);

insert into users(id, name, username, passwd, role) values("1", "Vo Trieu Vy", "vtvy", "$2b$09$FuI/wXnPQIBs9FjRjq1AM.xCMS9h04pP9cYy1/jFHdMQ3msAoG2sW", TRUE);

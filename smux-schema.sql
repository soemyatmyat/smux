DROP DATABASE IF EXISTS SMUX;

CREATE DATABASE SMUX;

USE SMUX;

CREATE TABLE Users
(
	_id int not null AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) not null,
	email_address VARCHAR(150) unique not null,
	password VARCHAR(60) binary not null,
	role VARCHAR(100) not null
)ENGINE = InnoDB;

INSERT INTO Users(name, email_address, password, role) VALUES ("rubik", "rubik@gmail.com", "$2a$10$Z4jKT5Z7WvRA1AtOf01a1Ohk02RfjGM1lAx.K/AeNBtiguPVvxC0S", "Admin");

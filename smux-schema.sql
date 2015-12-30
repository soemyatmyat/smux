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

CREATE TABLE Courses 
(
	_id int not null AUTO_INCREMENT PRIMARY KEY,
	code VARCHAR(10) not null,
	title VARCHAR(100) not null,
	faculty_id int not null,
	CONSTRAINT FOREIGN KEY(faculty_id) REFERENCES Users(_id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE = InnoDB;


CREATE TABLE Category /* for Project Grace Email */
(
	_id int not null AUTO_INCREMENT PRIMARY KEY,
	description VARCHAR(100) not null
)ENGINE = InnoDB;

CREATE TABLE Status /* Project Status - Open, Requested, On-Going, Closed */
(
	_id int not null AUTO_INCREMENT PRIMARY KEY,
	descritpion VARCHAR(100) not null
)ENGINE = InnoDB;

CREATE TABLE Projects
(
	_id int not null AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(100) not null,
	category VARCHAR(50) not null,
	contact_person VARCHAR(50) not null,
	contact_email VARCHAR(50) not null,
	contact_HP VARCHAR(50),
	description VARCHAR(1500) not null,
	posted_date date not null,
	start_date date,
	end_date date,
	org_id int,
	faculty_id int,
	course_id int,
	status VARCHAR(100) not null,
	term VARCHAR(10),
	CONSTRAINT FOREIGN KEY (org_id) REFERENCES Users(_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (faculty_id) REFERENCES Users(_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (course_id) REFERENCES Courses(_id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE = InnoDB;


CREATE TABLE Requests 
(
	_id int not null AUTO_INCREMENT PRIMARY KEY,
	course_code VARCHAR(10) not null,
	project_id int not null,
	faculty_id int not null,
	message VARCHAR(500),
	requested_date date not null,
	CONSTRAINT FOREIGN KEY (project_id) REFERENCES Projects(_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (faculty_id) REFERENCES Users(_id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE = InnoDB;

CREATE TABLE Feedbacks
(
	_id int not null AUTO_INCREMENT PRIMARY KEY,
	project_id int not null,
	user_id int not null,
	feedback_text VARCHAR(500) not null,
	CONSTRAINT FOREIGN KEY (user_id) REFERENCES Users(_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (project_id) REFERENCES Projects(_id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE = InnoDB;


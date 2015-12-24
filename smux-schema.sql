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
	faculty_id int not null FOREIGN KEY REFERENCES Users(_id)
)ENGINE = InnoDB:

CREATE TABLE Category /* for Project Grace Email */
(
	_id int not null AUTO_INCREMENT PRIMARY KEY,
	desc VARCHAR(100) not null
)ENGINE = InnoDB;

CREATE TABLE STATUS /* Project Status - Open, Requested, On-Going, Closed */
(
	_id int not null AUTO_INCREMENT PRIMARY KEY,
	desc VARCHAR(100) not null
)ENGINE = InnoDB;

CREATE TABLE Projects
(
	_id int not null AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(100) not null,
	category VARCHAR(50) not null,
	contact_person VARCHAR(50) not null,
	contact_email VARCHAR(50) not null,
	contact_HP VARCHAR(50),
	description VARCHAR(500) not null,
	posted_date date not null,
	start_date date,
	end_date date,
	org_id int FOREIGN KEY REFERENCES Users(_id),
	faculty_id int FOREIGN KEY REFERENCES Users(_id),
	course_id int FOREIGN KEY REFERENCES Courses(_id),
	message VARCHAR(500) not null,
	faculty_feedback_id int FOREIGN KEY REFERENCES Feedbacks(_id), 
	org_feedback_id int FOREIGN KEY REFERENCES Feedbacks(id),	
	status VARCHAR(100) not null
)ENGINE = InnoDB;

CREATE TABLE Feedbacks
(
	_id int not null AUTO_INCREMENT PRIMARY KEY,
	project_id int not null FOREIGN KEY REFERENCES RequestedProjects
	user_id int not null FOREIGN KEY REFERENCES Users(_id),
	feedback_text VARCHAR(500) not null
)ENGINE = InnoDB:


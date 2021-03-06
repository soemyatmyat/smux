--DROP DATABASE IF EXISTS SMUX;
DROP DATABASE IF EXISTS heroku_4e3503cbba1b2e6;
--CREATE DATABASE SMUX;
CREATE DATABASE heroku_4e3503cbba1b2e6;

--USE SMUX;
USE heroku_4e3503cbba1b2e6;

CREATE TABLE Users
(
	_id int not null AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) not null,
	email_address VARCHAR(150) unique not null,
	password VARCHAR(60) binary not null,
	role VARCHAR(100) not null
)ENGINE = InnoDB;

INSERT INTO Users(name, email_address, password, role) VALUES ("rubik", "rubik@gmail.com", "$2a$10$Z4jKT5Z7WvRA1AtOf01a1Ohk02RfjGM1lAx.K/AeNBtiguPVvxC0S", "Admin");
INSERT INTO Users(name, email_address, password, role) VALUES ("admin", "admin@gmail.com", "$2a$10$Z4jKT5Z7WvRA1AtOf01a1Ohk02RfjGM1lAx.K/AeNBtiguPVvxC0S", "Admin");
INSERT INTO Users(name, email_address, password, role) VALUES ("faculty", "faculty@gmail.com", "$2a$10$Z4jKT5Z7WvRA1AtOf01a1Ohk02RfjGM1lAx.K/AeNBtiguPVvxC0S", "Faculty");
INSERT INTO Users(name, email_address, password, role) VALUES ("organization", "org@gmail.com", "$2a$10$Z4jKT5Z7WvRA1AtOf01a1Ohk02RfjGM1lAx.K/AeNBtiguPVvxC0S", "Organization");

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
	order_id int not null,
	description VARCHAR(100) not null,
	short_form VARCHAR(100) not null
)ENGINE = InnoDB;

INSERT INTO Category(order_id, description, short_form) VALUES ("1", "Accounting", "Accounting");
INSERT INTO Category(order_id, description, short_form) VALUES ("2", "Arts", "Arts");
INSERT INTO Category(order_id, description, short_form) VALUES ("3", "Capstone", "Capstone");
INSERT INTO Category(order_id, description, short_form) VALUES ("4", "IT", "IT");
INSERT INTO Category(order_id, description, short_form) VALUES ("5", "Social Psychology", "Social_Psychology");

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
	course_id VARCHAR(10),
	status VARCHAR(100) not null,
	term VARCHAR(10),
	uploadFile VARCHAR(200),
	CONSTRAINT FOREIGN KEY (org_id) REFERENCES Users(_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (faculty_id) REFERENCES Users(_id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE = InnoDB;


CREATE TABLE Requests 
(
	_id int not null AUTO_INCREMENT PRIMARY KEY,
	course_code VARCHAR(10) not null,
	project_id int not null,
	faculty_id int not null,
	message VARCHAR(500),
	requested_date date not null,
	status VARCHAR(100),
	CONSTRAINT FOREIGN KEY (project_id) REFERENCES Projects(_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (faculty_id) REFERENCES Users(_id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE = InnoDB;

CREATE TABLE Feedbacks
(
	_id int not null AUTO_INCREMENT PRIMARY KEY,
	project_id int not null,
	user_id int not null,
	feedback_text VARCHAR(1000) not null,
	CONSTRAINT FOREIGN KEY (user_id) REFERENCES Users(_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FOREIGN KEY (project_id) REFERENCES Projects(_id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE = InnoDB;

CREATE TABLE Announcements
(
 _id int not null AUTO_INCREMENT PRIMARY KEY,
 faculty_id int not null,
 title VARCHAR(100) NOT NULL,
 category VARCHAR(50) NOT NULL,
 posted_date DATE NOT NULL,
 start_date DATE,
 end_date DATE,
 description VARCHAR(1500) NOT NULL,
 course_id VARCHAR(30),
 project_id int,
 uploadFile VARCHAR(200),
 status VARCHAR(100) NOT NULL,
 CONSTRAINT FOREIGN KEY (faculty_id) REFERENCES Users(_id) ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT FOREIGN KEY (project_id) REFERENCES Projects(_id) ON DELETE CASCADE ON UPDATE CASCADE
	
)ENGINE = InnoDB;

CREATE TABLE AnnouncementRequests
(
 _id int not null AUTO_INCREMENT PRIMARY KEY,
 org_id int not null,
 announcement_id int NOT NULL,
 posted_date DATE NOT NULL,
 course_id VARCHAR(30),
 project_id int NOT NULL,
 message VARCHAR(1500) NOT NULL,
 status VARCHAR(100) NOT NULL,
 CONSTRAINT FOREIGN KEY (org_id) REFERENCES Users(_id) ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT FOREIGN KEY (announcement_id) REFERENCES Announcements(_id) ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT FOREIGN KEY (project_id) REFERENCES Projects(_id) ON DELETE CASCADE ON UPDATE CASCADE
	
)ENGINE = InnoDB;





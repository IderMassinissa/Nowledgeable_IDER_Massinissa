CREATE DATABASE mabase;
\c mabase;
CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(80));
INSERT INTO users (email) VALUES ('email1@test.com');
INSERT INTO users (email) VALUES ('email2@test.com');
INSERT INTO users (email) VALUES ('email3@test.com');

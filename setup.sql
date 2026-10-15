-- À exécuter dans psql (ou dans l'outil de requête de pgAdmin, sans la ligne \c)

-- 1. Création de la base
CREATE DATABASE mabase;

-- 2. Connexion à la base (commande psql uniquement)
\c mabase;

-- 3. Création de la table
-- Note : la table s'appelle "users" et non "user", car "user" est un mot réservé en PostgreSQL
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(80)
);

-- 4. Données de test
INSERT INTO users (email) VALUES ('email1@test.com');
INSERT INTO users (email) VALUES ('email2@test.com');
INSERT INTO users (email) VALUES ('email3@test.com');

-- Vérification
SELECT * FROM users;

USE fiveMusics;

CREATE TABLE utilisateur (
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    prenom VARCHAR(50) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    sexe ENUM('M', 'F') NOT NULL,
    date_inscription TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);


CREATE TABLE musique (
    id INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    id_utilisateur INTEGER NOT NULL,
    artiste VARCHAR(50) NOT NULL,
    titre VARCHAR(50) NOT NULL,
    url_preview VARCHAR(255),
    url_cover_album_big VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id) ON DELETE CASCADE,
    CONSTRAINT unique_musique_per_user UNIQUE (id_utilisateur, titre, artiste)
);

CREATE TABLE Followers (
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    status ENUM('pending', 'accepted') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES utilisateur(id) ON DELETE CASCADE
);

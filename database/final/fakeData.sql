-- Permet d'insérer des données fictives dans le projet afin de procéder à des tests de ll'application

-- Insertions dans la table utilisateur
INSERT INTO utilisateur (prenom, nom, email, password, sexe, description, photo_profil) VALUES
('Alice', 'Dupont', 'alice.dupont@example.com', 'hashedpassword1', 'F', 'Amatrice de musique classique.', 'alice.jpg'),
('Bob', 'Martin', 'bob.martin@example.com', 'hashedpassword2', 'M', 'Fan de rock et de métal.', 'bob.jpg'),
('Claire', 'Dubois', 'claire.dubois@example.com', 'hashedpassword3', 'F', 'Passionnée par le jazz.', 'claire.jpg'),
('David', 'Moreau', 'david.moreau@example.com', 'hashedpassword4', 'M', 'Producteur de musique électronique.', 'david.jpg'),
('Eve', 'Rousseau', 'eve.rousseau@example.com', 'hashedpassword5', 'F', 'Chanteuse et compositrice.', 'eve.jpg');

-- Insertions dans la table musique
INSERT INTO musique (id_utilisateur, artiste, titre, url_preview, url_cover_album_big) VALUES
(1, 'Ludwig van Beethoven', 'Symphonie n°9', 'https://example.com/beethoven9.mp3', 'https://example.com/beethoven9.jpg'),
(2, 'Metallica', 'Enter Sandman', 'https://example.com/entersandman.mp3', 'https://example.com/entersandman.jpg'),
(3, 'Miles Davis', 'So What', 'https://example.com/sowhat.mp3', 'https://example.com/sowhat.jpg'),
(4, 'Daft Punk', 'Get Lucky', 'https://example.com/getlucky.mp3', 'https://example.com/getlucky.jpg'),
(5, 'Adele', 'Hello', 'https://example.com/hello.mp3', 'https://example.com/hello.jpg'),
(1, 'Wolfgang Amadeus Mozart', 'Requiem', 'https://example.com/mozartrequiem.mp3', 'https://example.com/mozartrequiem.jpg'),
(3, 'John Coltrane', 'Giant Steps', 'https://example.com/giantsteps.mp3', 'https://example.com/giantsteps.jpg');
(4, 'The Weeknd', 'Blinding Lights', 'https://example.com/blindinglights.mp3', 'https://example.com/blindinglights.jpg'),
(5, 'Ed Sheeran', 'Shape of You', 'https://example.com/shapeofyou.mp3', 'https://example.com/shapeofyou.jpg'),
(1, 'Frederic Chopin', 'Nocturne Op.9 No.2', 'https://example.com/nocturneop9no2.mp3', 'https://example.com/nocturneop9no2.jpg'),
(3, 'Herbie Hancock', 'Cantaloupe Island', 'https://example.com/cantaloupeisland.mp3', 'https://example.com/cantaloupeisland.jpg'),
(4, 'Calvin Harris', 'Summer', 'https://example.com/summer.mp3', 'https://example.com/summer.jpg'),
(2, 'Led Zeppelin', 'Stairway to Heaven', 'https://example.com/stairwaytoheaven.mp3', 'https://example.com/stairwaytoheaven.jpg'),
(5, 'Taylor Swift', 'Love Story', 'https://example.com/lovestory.mp3', 'https://example.com/lovestory.jpg'),
(1, 'Antonio Vivaldi', 'Four Seasons', 'https://example.com/fourseasons.mp3', 'https://example.com/fourseasons.jpg'),
(3, 'Nina Simone', 'Feeling Good', 'https://example.com/feelinggood.mp3', 'https://example.com/feelinggood.jpg'),
(4, 'Maroon 5', 'Sugar', 'https://example.com/sugar.mp3', 'https://example.com/sugar.jpg'),
(2, 'Queen', 'Bohemian Rhapsody', 'https://example.com/bohemianrhapsody.mp3', 'https://example.com/bohemianrhapsody.jpg'),
(5, 'Billie Eilish', 'Bad Guy', 'https://example.com/badguy.mp3', 'https://example.com/badguy.jpg');

-- Insertions dans la table Followers
INSERT INTO Followers (follower_id, following_id, status) VALUES
(1, 2, 'accepted'),
(1, 3, 'accepted'),
(2, 4, 'pending'),
(3, 4, 'accepted'),
(4, 5, 'accepted'),
(5, 1, 'pending');

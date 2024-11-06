[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Five-music-key&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Five-music-key)


[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Five-music-key&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Five-music-key)

[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Five-music-key&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=Five-music-key)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Five-music-key&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=Five-music-key)

[![codecov](https://codecov.io/github/Pierre-Rayan-Shakir-Organization/API-SPRING-test/branch/develop/graph/badge.svg?token=WUVB7ETPNA)](https://codecov.io/github/Pierre-Rayan-Shakir-Organization/API-SPRING-test)




+++
# Présentation de FiveMusic

**FiveMusic** est une plateforme sociale dédiée aux passionnés de musique, combinant les fonctionnalités d’un réseau social et d’une application de partage musical.

## Fonctionnalités Principales
- **Découverte Musicale** : Les utilisateurs peuvent explorer des morceaux, découvrir de nouvelles musiques, et "liker" leurs chansons préférées.
- **Interactions Sociales** : Chaque utilisateur a la possibilité d’ajouter des amis, favorisant les échanges et partages de goûts musicaux.
- **Partage de Contenus** : Les membres peuvent partager leurs morceaux préférés avec leurs amis, renforçant ainsi l'expérience sociale autour de la musique.

## Objectif
Créer un espace communautaire où les utilisateurs peuvent non seulement partager leurs découvertes musicales, mais aussi tisser des liens en fonction de leurs affinités musicales. Cela rend l'expérience de FiveMusic unique, car elle combine des aspects de la découverte musicale et des réseaux sociaux.

Avec ces fonctionnalités, FiveMusic aspire à rassembler une communauté unie par la passion de la musique et le plaisir du partage.
+++



+++
# Lancement du Projet FiveMusic avec NextJS et NodeJS


## Pré-requis
- **Base de données** : MySQL
- **Gestionnaire de paquets** : npm
- **Version de Node.js** : 22 ou supérieure

## Instructions de Lancement

### Étape 1 : Cloner le Projet Backend
1. Clonez le dépôt backend sur votre machine locale :
    ```bash
    git clone [URL_DU_DEPOT_BACKEND]
    ```
   
### Étape 2 : Configuration de la Base de Données MySQL
1. **Créer une base de données** MySQL nommée `fivemusics`.
2. **Initialiser la base** :
   - Exécutez le script SQL pour créer les tables nécessaires en important le fichier `database/final/v1.sql`.
3. **Configurer les informations de connexion** :
   - Ouvrez le fichier `src/database/pool.ts` et renseignez votre identifiant et mot de passe MySQL.

### Étape 3 : Installation des Dépendances et Démarrage
1. Placez-vous à la racine du projet backend :
   ```bash
   cd [CHEMIN_VERS_LE_PROJET]
   ```
2. **Installez les dépendances** avec npm :
   ```bash
   npm install
   ```
   
   
3. **Dans le fichier server.ts, enlevez les commentaires pour l'authentification avec middleware et rajouter des commentaires pour l'authentification sans.**


   
4. **Lancez le serveur** :
   ```bash
   npm start
   ```
5. **Vérification** :
   - Rendez-vous sur [http://localhost:3000](http://localhost:3000).
   - Assurez-vous que le message de bienvenue s'affiche, indiquant que l'API est correctement lancée.

## Lancement du Frontend

Pour accéder à l’interface utilisateur :

1. **Clonez le dépôt frontend** dans le répertoire parent du backend :
    ```bash
    git clone https://github.com/Pierre-Rayan-Shakir-Organization/Front
    ```
2. Suivez les instructions d'initialisation du frontend disponibles dans le dépôt.

Vous pouvez maintenant utiliser le projet FiveMusic dans sa totalité avec le frontend et le backend fonctionnels.
+++


Lien video de présentation : https://youtu.be/OnKnxxUhlso

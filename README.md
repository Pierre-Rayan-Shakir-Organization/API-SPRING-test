[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Five-music-key&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Five-music-key)


[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Five-music-key&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Five-music-key)

[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Five-music-key&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=Five-music-key)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Five-music-key&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=Five-music-key)

[![codecov](https://codecov.io/github/Pierre-Rayan-Shakir-Organization/API-SPRING-test/branch/develop/graph/badge.svg?token=WUVB7ETPNA)](https://codecov.io/github/Pierre-Rayan-Shakir-Organization/API-SPRING-test)









FiveMusic est un projet Typescript utilisant le framework NextJS pour le frontend et NodeJS pour l'API backend. 

# Pré-requis : MySQL, npm, Node 22+



# Lancement de l'application : 


Etape 1 : Cloner le projet sur votre poste local grâce à la commande ~ git clone

Etape 2 : Créer une base de données MySQL nommée **fivemusics** puis initialiser la base en insérant les tables présentes dans le fichier **database/final/v1.sql**. Se rendre ensuite dans le fichier **src/database/pool.ts** puis insérer votre identifiant et mot de passe de base de données.

Etape 3 : Se rendre à la racine du projet puis executer la commande **npm install** afin d'installer tout les modules/dépendances nécessaires, puis executer la commande **npm start**

L'API est correctement lancée (Verifiez bien que le message de Bienvenue s'affiche lorsque vous vous rendez sur localhost:3000)

Pour profiter du projet complet (c-a-d avec l'affichage utilisateur "frontend"), je vous invite à vous rendre sur ce repository afin de le cloner dans le répertoire parent de l'API, puis de suivre les étapes de son initialisation: https://github.com/Pierre-Rayan-Shakir-Organization/Front 

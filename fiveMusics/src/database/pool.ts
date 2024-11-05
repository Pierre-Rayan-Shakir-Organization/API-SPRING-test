import mysql2 from 'mysql2/promise';
// import dotenv from 'dotenv';

// dotenv.config(); // Charger les variables d'environnement depuis le fichier .env


export const pool = mysql2.createPool({

  /*
    MODIFIER password ET user AVEC LES IDENTIFIANTS DE VOTRE BASE DE DONNEES
  */

    host: "localhost",
    database: "fiveMusics",
    password: "motDePasse",
    user: "user",
    port: 3306
  });


/*
export const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
*/
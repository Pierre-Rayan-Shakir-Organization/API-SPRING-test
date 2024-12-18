import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement depuis le fichier .env

let db: Database | mysql2.Pool; // Typage de la base de données (SQLite ou MySQL)

if (process.env.NODE_ENV === 'test') {
    // Configuration pour SQLite en mémoire pour les tests
    console.log('Using SQLite in-memory database for tests');
    db = await open({
        filename: ':memory:',
        driver: sqlite3.Database,
    });
} else {
    // Configuration MySQL pour dev/prod
    console.log('Using MySQL for development/production');
    db = mysql2.createPool({
        host: "localhost",
        database: "fiveMusics",
        password: "",
        user: "root",
        port: 3306,
    });

    /*
    db = mysql2.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    */
}

export default db;

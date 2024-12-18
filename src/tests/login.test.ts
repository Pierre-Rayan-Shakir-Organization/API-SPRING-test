import request from 'supertest';
import app from '../server';
import db from '../database';

beforeAll(async () => {
    if (process.env.NODE_ENV === 'test') {
        // Créer la table "users" et insérer des données pour les tests
        await db.exec(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        `);

        await db.run(`
            INSERT INTO users (email, password)
            VALUES ('jean.dupont@example.com', 'password123')
        `);
    }
});

afterAll(async () => {
    if (process.env.NODE_ENV === 'test') {
        await db.close(); // Fermer SQLite après les tests
    }
});

describe('Tests de la route /login', () => {
    it('devrait connecter un utilisateur existant et retourner un token', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'jean.dupont@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.message).toBe('Utilisateur bien connecté !');
    });

    it('devrait retourner une erreur si l\'email est incorrect', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'nonexistent@example.com', password: 'password123' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Le mail n\'existe pas');
    });

    it('devrait retourner une erreur si le mot de passe est incorrect', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'jean.dupont@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('mot de passe incorrect');
    });
});

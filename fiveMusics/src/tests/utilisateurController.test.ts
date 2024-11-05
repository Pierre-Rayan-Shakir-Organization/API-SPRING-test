import request from 'supertest';
import app from '../server';

// test pour les routes utilisateurs

describe('Test des routes utilisateurs', () => {
    it('GET /getUsers', async () => {
        const response = await request(app).get('/getUsers');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('utilisateurs');
    });

    it('GET /getAllOtherUsers', async () => {
        const response = await request(app).get('/getAllOtherUsers');
        expect(response.status).toBe(401);
    });
});

// test pour les routes authentification

describe('Test des routes authentification', () => {
    it('POST /signup', async () => {
        const response = await request(app).post('/signup').send({
            "email" : "test@gmail.com",
            "password" : "test"
        });
        expect(response.status).toBe(200);
    }
    );
});

// email : test@gmail.com
// password : test
    it('POST /login', async () => {
        const response = await request(app).post('/login').send({
            "email" : "test@gmail.com",
            "password" : "test"
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    }
    );


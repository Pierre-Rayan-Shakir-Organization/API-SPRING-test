import request from 'supertest';
import app from '../server';

// test pour les routes musique

describe('Test des routes musique', () => {
    it('POST /addMusic', async () => {
        const response = await request(app).post('/addMusic').send({
            "title" : "test",
            "artist" : "test",
            "url" : "test"
        });
        expect(response.status).toBe(401);
    });

    it('GET /getMusic', async () => {
        const response = await request(app).get('/getMusic');
        expect(response.status).toBe(401);
    });

    it('DELETE /deleteMusic/:idMusic', async () => {
        const response = await request(app).delete('/deleteMusic/1');
        expect(response.status).toBe(401);
    });

    it('GET /getMusicsByUserId/:idUser', async () => {
        const response = await request(app).get('/getMusicsByUserId/1');
        expect(response.status).toBe(401);
    });

    it('GET /getRandomMusic', async () => {
        const response = await request(app).get('/getRandomMusic');
        expect(response.status).toBe(401);
    });
});
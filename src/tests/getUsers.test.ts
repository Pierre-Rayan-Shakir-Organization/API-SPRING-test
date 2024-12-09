import request from 'supertest';
import app from '../server'; // Ajustez le chemin en fonction de la structure de votre projet

describe('Test des routes utilisateurs', () => {
  describe('GET /getUsers', () => {
    it('doit retourner la liste des utilisateurs', async () => {
      const response = await request(app).get('/getUsers');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });
});

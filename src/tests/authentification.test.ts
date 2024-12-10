import request from 'supertest';
import app from '../server';

describe('Tests de la route /login', () => {
    it('devrait connecter un utilisateur existant et retourner un token', async () => {
        // Assurez-vous qu'un utilisateur avec cet email et mot de passe existe dans votre base de données
        const response = await request(app)
            .post('/login')
            .send({ email: 'jean.dupont@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.message).toBe('Utilisateur bien connécté !');
    });

    it('devrait retourner une erreur si l\'email est incorrect', async () => {
      const response = await request(app)
          .post('/login')
          .send({ email: 'nonexistent@example.com', password: 'password123' });
  
      console.log('Réponse pour email inexistant:', response.body); // Inspecte le body
      console.log('Statut de la réponse:', response.status); // Inspecte le statut
  
      expect(response.status).toBe(401);
      
      // Vérifie le message directement si le body n'est pas interprété comme JSON
      if (typeof response.body === 'string') {
          expect(response.body).toBe('Le mail n\'éxiste pas');
      } else {
          expect(response.body.message).toBe('Le mail n\'éxiste pas');
      }
  });
  

    it('devrait retourner une erreur si le mot de passe est incorrect', async () => {
        // Assurez-vous qu'un utilisateur avec cet email existe dans votre base de données
        const response = await request(app)
            .post('/login')
            .send({ email: 'jean.dupont@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('mot de passe incorrect');
    });
});

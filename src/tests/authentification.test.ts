import request from 'supertest';
import app from '../server'; // Assure-toi que ton app est exportée dans server.ts
import jwt from 'jsonwebtoken';
import UtilisateurService from '../database/utilisateurService';

// Mocks pour UtilisateurService et jwt
jest.mock('../database/utilisateurService');
jest.spyOn(jwt, 'sign').mockImplementation(() => 'fake-jwt-token');
jest.mock('../middlewares/authentification', () => ({
  verifyEmailLogin: jest.fn((req, res, next) => next()),
  verifyPassword: jest.fn((req, res, next) => next()),
}));

// Configuration des mocks
const mockUtilisateurService = {
  getUserByEmail: jest.fn(),
  verifyPassword: jest.fn(),
};

// Remplace l'instance de `UtilisateurService` par le mock
(UtilisateurService as jest.Mock).mockImplementation(() => mockUtilisateurService);

describe('Tests des routes d\'authentification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /login', () => {
    it('devrait connecter un utilisateur et retourner un token', async () => {
      const userInput = { email: 'jean.dupont@example.com', password: 'password123' };
      const userFromDB = { id: 1, email: userInput.email };

      console.log('getUserByEmail mock:', mockUtilisateurService.getUserByEmail.mockResolvedValue);
      console.log('verifyPassword mock:', mockUtilisateurService.verifyPassword.mockResolvedValue);

  
      mockUtilisateurService.getUserByEmail.mockResolvedValue({
        id: 1,
        email: 'jean.dupont@example.com',
      });
      
      mockUtilisateurService.verifyPassword.mockResolvedValue(true);
  
      const response = await request(app)
          .post('/login')
          .send(userInput);
  
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
          message: 'Utilisateur bien connécté !',
          token: 'fake-jwt-token',
      });
  });

    it('devrait retourner 401 si le mot de passe est incorrect', async () => {
      const userInput = { email: 'jean.dupont@example.com', password: 'wrongpassword' };

      mockUtilisateurService.getUserByEmail.mockResolvedValue({ email: userInput.email });
      mockUtilisateurService.verifyPassword.mockResolvedValue(false);

      const response = await request(app)
        .post('/login')
        .send(userInput);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('mot de passe incorrect');

      expect(mockUtilisateurService.verifyPassword).toHaveBeenCalledWith(userInput.email, userInput.password);
    });

    it('devrait retourner 401 si l\'email n\'existe pas', async () => {
      const userInput = { email: 'unknown@example.com', password: 'password123' };

      mockUtilisateurService.getUserByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/login')
        .send(userInput);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Le mail n\'éxiste pas');

      expect(mockUtilisateurService.getUserByEmail).toHaveBeenCalledWith(userInput.email);
    });
  });
});

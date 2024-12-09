import request from 'supertest';
import app from '../server'; // Assure-toi que ton app est correctement exportée
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
  // Réinitialiser les mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /login', () => {
    it('devrait connecter un utilisateur et retourner un token', async () => {
      const userInput = { email: 'jean.dupont@example.com', password: 'password123' };
      const userFromDB = { id: 1, email: userInput.email };

      // Configuration des mocks
      mockUtilisateurService.getUserByEmail.mockResolvedValue(userFromDB);
      mockUtilisateurService.verifyPassword.mockResolvedValue(true);

      // Envoi de la requête
      const response = await request(app)
        .post('/login')
        .send(userInput);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Utilisateur bien connécté !',
        token: 'fake-jwt-token',
      });

      // Vérification des appels aux méthodes mockées
      expect(mockUtilisateurService.getUserByEmail).toHaveBeenCalledWith(userInput.email);
      expect(mockUtilisateurService.verifyPassword).toHaveBeenCalledWith(userInput.email, userInput.password);
      expect(jwt.sign).toHaveBeenCalled();
    });

    it('devrait retourner 401 si le mot de passe est incorrect', async () => {
      const userInput = { email: 'jean.dupont@example.com', password: 'wrongpassword' };

      // Configuration des mocks
      mockUtilisateurService.getUserByEmail.mockResolvedValue({ email: userInput.email });
      mockUtilisateurService.verifyPassword.mockResolvedValue(false);

      // Envoi de la requête
      const response = await request(app)
        .post('/login')
        .send(userInput);

      // Assertions
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('mot de passe incorrect');

      // Vérification des appels aux méthodes mockées
      expect(mockUtilisateurService.getUserByEmail).toHaveBeenCalledWith(userInput.email);
      expect(mockUtilisateurService.verifyPassword).toHaveBeenCalledWith(userInput.email, userInput.password);
    });

    it('devrait retourner 401 si l\'email n\'existe pas', async () => {
      const userInput = { email: 'unknown@example.com', password: 'password123' };

      // Configuration des mocks
      mockUtilisateurService.getUserByEmail.mockResolvedValue(null);

      // Envoi de la requête
      const response = await request(app)
        .post('/login')
        .send(userInput);

      // Assertions
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Le mail n\'éxiste pas');

      // Vérification des appels aux méthodes mockées
      expect(mockUtilisateurService.getUserByEmail).toHaveBeenCalledWith(userInput.email);
    });
  });
});

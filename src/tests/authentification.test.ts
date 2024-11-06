import request from 'supertest';
import app from '../server';
import jwt from 'jsonwebtoken';
import { secretKey } from '../secretKey';
import UtilisateurService from '../database/utilisateurService';
import { pool } from '../database/pool';

// Middleware factice pour injecter user dans req pour le test de /signup
app.use((req, res, next) => {
    if (req.path === '/signup') {
        (req as any).user = {
            prenom: 'Jean',
            nom: 'Dupont',
            email: 'jean.dupont@example.com',
            password: 'password123',
            sexe: 'M',
        };
    }
    next();
});


jest.mock('../database/utilisateurService'); // Mock UtilisateurService
jest.mock('../database/pool'); // Mock pool pour la connexion à la DB

describe('Tests des routes d\'authentification', () => {
  let mockUtilisateurService: jest.Mocked<UtilisateurService>;

  beforeEach(() => {
    mockUtilisateurService = new UtilisateurService() as jest.Mocked<UtilisateurService>;
    (UtilisateurService as jest.Mock).mockClear();
    (pool.execute as jest.Mock).mockReset();
    jest.spyOn(jwt, 'sign').mockImplementation(() => 'fake-jwt-token'); // Mock de jwt.sign pour éviter l'erreur
  });

 

  describe('POST /login', () => {
    it('devrait connecter un utilisateur et retourner un token', async () => {
        const userWithoutPassword = {
            id: 1,
            prenom: 'Jean',
            nom: 'Dupont',
            email: 'jean.dupont@example.com',
            sexe: 'M' as const,
          };
    

      mockUtilisateurService.getUserByEmail.mockResolvedValue(userWithoutPassword);
      mockUtilisateurService.verifyPassword.mockResolvedValue(true);

      const response = await request(app)
        .post('/login')
        .send({ email: 'jean.dupont@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Utilisateur bien connécté !',
        token: 'fake-jwt-token', // Vérifie le token mocké
      });
    });
    });


    describe('Test des routes utilisateurs', () => {
   
        it('GET /getAllOtherUsers', async () => {
            const response = await request(app).get('/getAllOtherUsers');
            expect(response.status).toBe(401);
        });
    });



  });

import { signup } from '../controleurs/authentification';
import { Request, Response } from 'express';
import UtilisateurService from '../database/utilisateurService';

jest.mock('../database/utilisateurService');
const mockCreateUser = jest.spyOn(UtilisateurService.prototype, 'createUser');
const mockGetUserByEmail = jest.spyOn(UtilisateurService.prototype, 'getUserByEmail');

describe('signup Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        res = {
            status: jest.fn().mockReturnThis(),
            json: jsonMock
        };
        req = {
            body: {
                prenom: "Samy",
                nom: "Doe",
                email: "samy.doe@example.com",
                password: "password123",
                sexe: "M",
                description: "Je suis passionné de musique",
                photo_profil: "/uploads/ppProfil.png"
            }
        };
    });

    it('devrait créer un utilisateur et renvoyer un statut 201', async () => {
        mockCreateUser.mockResolvedValueOnce(undefined);
        mockGetUserByEmail.mockResolvedValueOnce({
            id: 1,
            ...req.body
        });

        await signup(req as Request, res as Response);

        expect(mockCreateUser).toHaveBeenCalledWith(req.body);
        expect(mockGetUserByEmail).toHaveBeenCalledWith(req.body.email);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalledWith({
            message: "Utilisateur bien inscrit dans la base de données",
            utilisateur: {
                id: 1,
                ...req.body
            }
        });
    });
});

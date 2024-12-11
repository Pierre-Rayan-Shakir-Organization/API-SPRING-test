import UtilisateurService, { Utilisateur } from '../database/utilisateurService';
import { pool } from '../database/pool';

// Mock du pool MySQL
jest.mock('../database/pool', () => ({
    pool: {
        execute: jest.fn()
    }
}));

const mockPool = pool.execute as jest.Mock;

describe('UtilisateurService', () => {
    let utilisateurService: UtilisateurService;

    beforeEach(() => {
        utilisateurService = new UtilisateurService();
        jest.clearAllMocks();
    });

    test('createUser devrait insérer un utilisateur avec description et photo_profil', async () => {
        const user: Utilisateur = {
            prenom: "Samy",
            nom: "Doe",
            email: "samy.doe@example.com",
            password: "password123",
            sexe: "M",
            description: "Je suis passionné de musique",
            photo_profil: "/uploads/ppProfil.png"
        };

        await utilisateurService.createUser(user);

        expect(mockPool).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO utilisateur"),
            [
                user.prenom,
                user.nom,
                user.email,
                user.password,
                user.sexe,
                user.description,
                user.photo_profil
            ]
        );
    });

    test('getUserByEmail devrait retourner un utilisateur avec description et photo_profil', async () => {
        const userFromDB = [{
            id: 1,
            prenom: "Samy",
            nom: "Doe",
            email: "samy.doe@example.com",
            sexe: "M",
            description: "Je suis passionné de musique",
            photo_profil: "/uploads/ppProfil.png"
        }];

        mockPool.mockResolvedValue([userFromDB]);

        const result = await utilisateurService.getUserByEmail("samy.doe@example.com");

        expect(result).toEqual(userFromDB[0]);
        expect(mockPool).toHaveBeenCalledWith(
            expect.stringContaining("SELECT id, prenom, nom"),
            ["samy.doe@example.com"]
        );
    });

    test('getUserById devrait retourner un utilisateur avec description et photo_profil', async () => {
        const userFromDB = [{
            id: 1,
            prenom: "Samy",
            nom: "Doe",
            email: "samy.doe@example.com",
            sexe: "M",
            description: "Je suis passionné de musique",
            photo_profil: "/uploads/ppProfil.png"
        }];

        mockPool.mockResolvedValue([userFromDB]);

        const result = await utilisateurService.getUserById(1);

        expect(result).toEqual(userFromDB[0]);
        expect(mockPool).toHaveBeenCalledWith(
            expect.stringContaining("SELECT id, prenom, nom"),
            [1]
        );
    });
});

import UtilisateurService from "../database/utilisateurService";
import UtilisateurConnexion, {Utilisateur} from "../database/utilisateurService";
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { secretKey } from "../secretKey";

export const signup = async (req : Request, res : Response) : Promise<void> => {
    const utilisateurService : UtilisateurService = new UtilisateurService();
    try {
        const user : Utilisateur = (req as any).user as Utilisateur;
        await utilisateurService.createUser(user);
        const userFromDataBase : Omit<Utilisateur, "password"> = await utilisateurService.getUserByEmail(user.email);
        res.status(200).json({
            "message" : "Utilisateur bien inscrit dans la base de données",
            "utilisateur" : userFromDataBase
        });
    } catch(error) {
        res.status(401).json(error);
        console.log(error);
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const utilisateurService = new UtilisateurService();
    try {
        const { email, password } = req.body;

        console.log('Requête reçue:', { email, password });

        const user = await utilisateurService.getUserByEmail(email);
        console.log('Utilisateur trouvé:', user);

        if (!user) {
            res.status(401).json({ message: 'Le mail n\'éxiste pas' });
            return;
        }

        const isPasswordValid = await utilisateurService.verifyPassword(email, password);
        console.log('Mot de passe valide:', isPasswordValid);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'mot de passe incorrect' });
            return;
        }

        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Utilisateur bien connécté !',
            token,
        });
    } catch (error) {
        console.log('Erreur serveur:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

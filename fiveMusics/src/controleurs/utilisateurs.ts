import UtilisateurService, {Utilisateur} from "../database/utilisateurService";
import { Request, Response } from "express";

export const getAllUsers = async (req : Request, res : Response) : Promise<void> => {
    const userService : UtilisateurService = new UtilisateurService();
    try {
        const users : Omit<Utilisateur, "password">[] = await userService.getAllUsers();
        res.status(200).json({
            "utilisateurs" : users
        });
    } catch(error) {res.status(401).json(error);}
}

export const getAllOtherUsers = async (req : Request, res : Response) : Promise<void> => {
    const userService : UtilisateurService = new UtilisateurService();
    try {
        const user : Utilisateur = (req as any).user;
        const id_user : number = user.id as number;
        const users : Omit<Utilisateur, "password">[] = await userService.getAllOtherUsers(id_user);
        res.status(200).json({
            "utilisateurs" : users
        });
    } catch(error) {res.status(401).json(error);}
}
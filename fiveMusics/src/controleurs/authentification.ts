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

export const login = async (req : Request, res : Response) : Promise<void> => {
    const utilisateurService : UtilisateurService = new UtilisateurService();
    try {
        const playload : Omit<Utilisateur, "password"> = (req as any).user;
        const token : string = jwt.sign(playload, secretKey, {expiresIn : "1h"});
        res.status(200).json({
            "message" : "Utilisateur bien connécté !",
            "token" : token
        });
    } catch(error) {
        res.status(404).json(error);
        console.log(error);
    }
}
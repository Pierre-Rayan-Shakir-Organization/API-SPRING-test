import { Request, Response, NextFunction } from "express";
import UtilisateurService, {Utilisateur, UtilisateurConnexion} from "../database/utilisateurService";
import { secretKey } from "../secretKey";
import jwt from 'jsonwebtoken';

export const verifyEmailSingup = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const utilisateurService : UtilisateurService = new UtilisateurService();
    try {
        const user : Utilisateur = req.body;
        const result : boolean = await utilisateurService.verifyEmail(user.email);
        if (result === false) {
            (req as any).user = user;
            next();
        }
        else {
            res.status(401).json({"message" : "Le mail existe déja"});
        }
    } catch(error) {
        res.status(401).json({"error" : error});
    }
}

export const verifyEmailLogin = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const utilisateurService : UtilisateurService = new UtilisateurService();
    try {
        const user : UtilisateurConnexion = req.body;
        const result : boolean = await utilisateurService.verifyEmail(user.email);
        if (result) {
            (req as any).userConnexion = user as UtilisateurConnexion;
            next();
        }
        else {
            res.status(401).json("Le mail n'éxiste pas");
        }
    }
    catch (error) {
        res.status(401).json({"error" : error});
    }
}

export const verifyPassword = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    const utilisateurService : UtilisateurService = new UtilisateurService();
    try {
        const userConnexion : UtilisateurConnexion = (req as any).userConnexion as UtilisateurConnexion;
        const result : boolean = await utilisateurService.verifyPassword(userConnexion.email, userConnexion.password);
        if (result) {
            const user : Omit<Utilisateur, "password"> = await utilisateurService.getUserByEmail(userConnexion.email);
            (req as any).user = user as Omit<Utilisateur, "password">;
            next();
        }
        else {
            res.status(401).json({"message" : "mot de passe incorrect"});
        }
    } catch (error) {res.status(404).json(error);}
}

export const verifyToken = (req : Request, res : Response, next : NextFunction) : void => {
    try {
        const token : string = req.headers.authorization?.split(' ')[1] as string;
        jwt.verify(token, secretKey, (error, decoded)=> {
            if (error) {
                res.status(401).json({"message" : "Token non valide"});
                return;
            }
            const playload : Omit<Utilisateur, "password"> = decoded as Omit<Utilisateur, "password">;
            (req as any).user = playload;
            next();
        });
    }
    catch (error) {
        res.status(401).json({"error" : error});
    }
}
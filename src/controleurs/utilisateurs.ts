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

const utilisateurService = new UtilisateurService();

export const createProfile = async (req: Request, res: Response) => {
    try {
        const { prenom, nom, email, password, sexe, description, photo_profil } = req.body;

        await utilisateurService.createUser({
            prenom,
            nom,
            email,
            password,
            sexe,
            description: description || null,
            photo_profil: photo_profil || null,
        });

        res.status(201).json({ message: "Profil créé avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du profil", error });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { id } = (req as any).user; // Récupérer l'ID utilisateur via le token
        const { description } = req.body;
        let photo_profil = req.body.photo_profil || null;

        if (req.file) {
            photo_profil = `/uploads/${req.file.filename}`; // Définir l'URL du fichier uploadé
        }

        if (!description && !photo_profil) {
            return res.status(400).json({ message: "Aucun champ à mettre à jour." });
        }

        // Mettre à jour uniquement les champs fournis
        await utilisateurService.updateProfile(id, {
            description: description || null,
            photo_profil: photo_profil || null,
        });

        res.status(200).json({ message: "Profil mis à jour avec succès !" });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil :", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du profil", error });
    }
};
export const getProfile = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        const user = await utilisateurService.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: "Profil non trouvé" });
        }

        res.status(200).json({ profil: user });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du profil", error });
    }
};

export const getCurrentUserProfile = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user; // L'utilisateur connecté (via token middleware)
        const id = user.id;

        const userProfile = await utilisateurService.getUserById(id);
        if (!userProfile) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json({ profil: userProfile });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du profil", error });
    }
};
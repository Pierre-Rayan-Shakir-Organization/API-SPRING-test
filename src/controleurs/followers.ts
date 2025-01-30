import { Request, Response } from "express";
import FollowersService from "../database/followers";
import { Utilisateur } from "../database/utilisateurService";

const followersService = new FollowersService();

// Suivre un utilisateur
export const followUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        const followingId: number = parseInt(req.params.followingId, 10);

        await followersService.followUser(user.id as number, followingId);
        res.status(200).json({ message: `Demande de suivi envoyée à l'utilisateur ${followingId}` });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Annuler le suivi d'un utilisateur
export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        const followingId: number = parseInt(req.params.followingId, 10);

        await followersService.unfollowUser(user.id as number, followingId);
        res.status(200).json({ message: `Vous ne suivez plus l'utilisateur ${followingId}` });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Accepter une demande de suivi
export const acceptFollow = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;

        console.log("📩 Paramètres reçus :", req.params);

        const followerId: number = parseInt(req.params.followerId, 10);
        if (isNaN(followerId)) {
            console.error("❌ Erreur: ID du follower invalide", req.params.followerId);
            return res.status(400).json({ error: "ID du follower invalide" }); // ✅ Retourne Response
        }

        console.log("🔄 Acceptation de follow - followerId:", followerId, "followingId:", user.id);

        const success = await followersService.acceptFollow(followerId, user.id as number);
        
        if (success) {
            return res.status(200).json({ message: `Vous avez accepté la demande de suivi de l'utilisateur ${followerId}` }); // ✅ Retourne Response
        } else {
            return res.status(404).json({ message: `Aucune demande de suivi en attente pour cet utilisateur.` }); // ✅ Retourne Response
        }
    } catch (error) {
        console.error("❌ Erreur dans acceptFollow :", error);
        return res.status(500).json({ error: "Une erreur est survenue." }); // ✅ Retourne Response
    }
};





// Refuser une demande de suivi
export const rejectFollowRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        const followerId: number = parseInt(req.params.followerId, 10);

        await followersService.rejectFollowRequest(followerId, user.id as number);
        res.status(200).json({ message: `Vous avez refusé la demande de suivi de l'utilisateur ${followerId}` });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Obtenir la liste des followers
export const getFollowers = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;

        const followers = await followersService.getFollowers(user.id as number);
        res.status(200).json({ followers });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Obtenir la liste des utilisateurs suivis
export const getFollowing = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;

        const following = await followersService.getFollowing(user.id as number);
        res.status(200).json({ following });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        const { prenom, nom } = req.query;

        console.log("🔍 Requête API reçue:", { userId: user.id, prenom, nom });

        const results = await followersService.recherche(user.id as number, prenom as string, nom as string);
        
        console.log("✅ Résultats SQL renvoyés :", results); // Vérifier le statut des utilisateurs
        res.status(200).json({ results });
    } catch (error) {
        console.error("❌ Erreur API searchUsers:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

// Obtenir la liste des follow en attente
export const getFollowPending = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        console.log("📩 Requête pour les follow en attente de l'utilisateur:", user.id);

        const pendingRequests = await followersService.getFollowPending(user.id as number);
        
        console.log("✅ Demandes de follow en attente :", pendingRequests); // 🔥 Vérifie si l'ID est bien présent
        return res.status(200).json(pendingRequests);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des demandes de follow en attente :", error);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
};


export const getFollowersPending = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        console.log("📩 Requête pour les follow en attente envoyés par l'utilisateur:", user.id);

        const pendingFollowers = await followersService.getFollowersPending(user.id as number);
        
        console.log("✅ Demandes de follow envoyées en attente :", pendingFollowers);
        res.status(200).json(pendingFollowers);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des demandes de follow envoyées en attente :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};


// Compter les followers d’un utilisateur
export const countFollowers = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;

        const followersCount = await followersService.countFollowers(user.id as number);
        res.status(200).json({ followersCount });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Compter les utilisateurs suivis
export const countFollowing = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;

        const followingCount = await followersService.countFollowing(user.id as number);
        res.status(200).json({ followingCount });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export default {
    followUser,
    unfollowUser,
    acceptFollow,
    rejectFollowRequest,
    getFollowers,
    getFollowing,
    searchUsers,
    countFollowers,
    countFollowing,
};

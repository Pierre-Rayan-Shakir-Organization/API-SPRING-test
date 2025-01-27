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
export const acceptFollow = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        const followerId: number = parseInt(req.params.followerId, 10);

        await followersService.acceptFollow(followerId, user.id as number);
        res.status(200).json({ message: `Vous avez accepté la demande de suivi de l'utilisateur ${followerId}` });
    } catch (error) {
        res.status(500).json({ error });
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

// Rechercher des utilisateurs
export const searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        const { prenom, nom } = req.query;

        const results = await followersService.recherche(user.id as number, prenom as string, nom as string);
        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ error });
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

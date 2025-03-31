import { Request, Response } from 'express';
import MusicLikesModel from '../database/musicLikesModel';
// Définition d'un type personnalisé qui inclut `user`
interface AuthenticatedRequest extends Request {
    user?: { id: number }; // Ajoute `user.id`
}

export const likeMusic = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }

        const userId = req.user.id;
        const musicId = parseInt(req.params.musicId, 10);
        const result = await MusicLikesModel.likeMusic(userId, musicId);
        res.json(result);
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
        res.status(500).json({ error: errMessage });
    }
};


export const getPopularMusic = async (req: Request, res: Response) => {
    try {
        const period = req.query.period as string || 'week';
        const popularMusic = await MusicLikesModel.getPopularMusic(period);
        res.json(popularMusic);
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
        res.status(500).json({ error: errMessage });    }
};

import { Request, Response } from 'express';
import db from '../database';

export const addVote = async (req: Request, res: Response) => {
    try {
        const { userId, musicId, vote } = req.body;

        // Vérifier si l'utilisateur a déjà voté pour cette musique
        const [existingVote] = await db.query(
            'SELECT * FROM votes WHERE user_id = ? AND music_id = ?',
            [userId, musicId]
        );

        if (existingVote) {
            // Mettre à jour le vote existant
            await db.query(
                'UPDATE votes SET vote = ? WHERE user_id = ? AND music_id = ?',
                [vote, userId, musicId]
            );
        } else {
            // Créer un nouveau vote
            await db.query(
                'INSERT INTO votes (user_id, music_id, vote) VALUES (?, ?, ?)',
                [userId, musicId, vote]
            );
        }

        res.status(200).json({ message: 'Vote enregistré avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du vote:', error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement du vote' });
    }
}; 
import { Request, Response } from 'express';
import { getLyrics } from 'genius-lyrics-api';
import OpenAI from 'openai';
import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../database/pool';

interface Musique extends RowDataPacket {
    titre: string;
    artiste: string;
}

const openai = new OpenAI({
    apiKey: process.env.key_gpt
});

export const getLyricsAndSummary = async (req: Request, res: Response) => {
    try {
        const { musicId } = req.params;

        if (!process.env.client_access_token_genius) {
            return res.status(500).json({ message: 'Clé API Genius non configurée' });
        }

        // Récupérer les informations de la musique
        const [rows] = await pool.execute<Musique[]>(
            'SELECT titre, artiste FROM musique WHERE id = ?',
            [musicId]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'Musique non trouvée' });
        }

        const music = rows[0];

        // Récupérer les lyrics depuis Genius
        const options = {
            apiKey: process.env.client_access_token_genius,
            title: music.titre,
            artist: music.artiste,
            optimizeQuery: true
        };

        const lyrics = await getLyrics(options);

        if (!lyrics) {
            return res.status(404).json({ message: 'Paroles non trouvées' });
        }

        // Obtenir un résumé avec ChatGPT
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Tu es un expert en analyse de paroles de chansons. Fournis un résumé concis des thèmes principaux et du message de la chanson."
                },
                {
                    role: "user",
                    content: `Analyse les paroles suivantes et fournis un résumé :\n\n${lyrics}`
                }
            ],
            max_tokens: 500
        });

        const summary = completion.choices[0].message.content;

        // Obtenir le thème principal en un mot
        const themeCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Tu es un expert en analyse de paroles de chansons. Réponds uniquement avec un mot qui représente le thème principal de la chanson."
                },
                {
                    role: "user",
                    content: `Quel est le thème principal de cette chanson en un seul mot ?( exemple : amour, amitié, solitude, etc.)\n\n${lyrics}`
                }
            ],
            max_tokens: 50
        });

        const theme = themeCompletion.choices[0].message.content?.trim();

        res.status(200).json({
            titre: music.titre,
            artiste: music.artiste,
            lyrics: lyrics,
            summary: summary,
            theme: theme
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des paroles ou du résumé:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des paroles ou du résumé' });
    }
}; 
import { Request, Response } from 'express';
import { google } from 'googleapis';
import db from '../database';

const oauth2Client = new google.auth.OAuth2(
    "898958448984-3glgj7qig64qfh2vn81chlpsq9utb7g4.apps.googleusercontent.com",
    "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",
    "http://localhost:4000"
);

export const addEventToCalendar = async (req: Request, res: Response) => {
    try {
        const { musicId, userId } = req.body;
        
        // Récupérer le refresh token de l'utilisateur
        const [user] = await db.query('SELECT google_refresh_token FROM users WHERE id = ?', [userId]);
        
        if (!user || !user.google_refresh_token) {
            return res.status(400).json({ message: 'Utilisateur non connecté à Google Calendar' });
        }

        // Récupérer les informations de la musique
        const [music] = await db.query('SELECT title, artist FROM musics WHERE id = ?', [musicId]);
        
        if (!music) {
            return res.status(404).json({ message: 'Musique non trouvée' });
        }

        // Configurer les credentials
        oauth2Client.setCredentials({
            refresh_token: user.google_refresh_token
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // Créer l'événement
        const event = {
            summary: `Écoute de ${music.title}`,
            description: `Artiste: ${music.artist}`,
            start: {
                dateTime: new Date().toISOString(),
                timeZone: 'Europe/Paris',
            },
            end: {
                dateTime: new Date(Date.now() + 3 * 60 * 1000).toISOString(), // 3 minutes
                timeZone: 'Europe/Paris',
            },
        };

        await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });

        res.status(200).json({ message: 'Événement ajouté avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'événement:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'événement' });
    }
};

export const getRecentListens = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        
        // Récupérer le refresh token de l'utilisateur
        const [user] = await db.query('SELECT google_refresh_token FROM users WHERE id = ?', [userId]);
        
        if (!user || !user.google_refresh_token) {
            return res.status(400).json({ message: 'Utilisateur non connecté à Google Calendar' });
        }

        // Configurer les credentials
        oauth2Client.setCredentials({
            refresh_token: user.google_refresh_token
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // Calculer la date d'il y a 7 jours
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: sevenDaysAgo.toISOString(),
            timeMax: new Date().toISOString(),
            q: 'Écoute de', // Filtrer uniquement les événements d'écoute
        });

        res.status(200).json(response.data.items);
    } catch (error) {
        console.error('Erreur lors de la récupération des écoutes:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des écoutes' });
    }
}; 
import { Request, Response } from 'express';
import { google } from 'googleapis';
import db from '../database';
import { oauth2Client } from '../connexionGoogleCalendar';

export const addEventToCalendar = async (req: Request, res: Response) => {
    console.log('💬 Reçu dans req.body :', req.body);
    //console.log('💬 Reçu dans req.params :', req.params);
    try {
      const { titre, artiste, date, userId } = req.body;
  
      if (!titre || !artiste || !date || !userId) {
        return res.status(400).json({ message: 'Champs manquants dans la requête' });
      }
  
      // ✅ Récupérer le refresh_token depuis la table utilisateur_google
      const [rows] = await db.query(
        'SELECT refresh_token FROM utilisateur_google WHERE utilisateur_id = ?',
        [userId]
      );
      const user = (rows as any[])[0];
  
      if (!user || !user.refresh_token) {
        return res.status(400).json({ message: 'Utilisateur non connecté à Google Calendar' });
      }
  
      // ✅ Authentifier auprès de Google avec le refresh_token
      oauth2Client.setCredentials({
        refresh_token: user.refresh_token,
      });
  
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
      const event = {
        summary: `Écoute de ${titre}`,
        description: `Artiste: ${artiste}`,
        start: {
          dateTime: date,
          timeZone: 'Europe/Paris',
        },
        end: {
          dateTime: new Date(new Date(date).getTime() + 3 * 60 * 1000).toISOString(),
          timeZone: 'Europe/Paris',
        },
      };
  
      await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });
  
      res.status(200).json({ message: 'Événement ajouté avec succès' });
    } catch (error) {
      console.error("❌ Erreur lors de l’ajout de l’événement:", error);
      res.status(500).json({ message: 'Erreur lors de l’ajout de l’événement' });
    }
  };
  

  export const getRecentListens = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
  
      // ✅ Récupérer le refresh token depuis la table utilisateur_google
      const [rows] = await db.query(
        'SELECT refresh_token FROM utilisateur_google WHERE utilisateur_id = ?',
        [userId]
      );
      const user = (rows as any[])[0];
  
      if (!user || !user.refresh_token) {
        return res.status(400).json({ message: 'Utilisateur non connecté à Google Calendar' });
      }
  
      // ✅ Authentifier auprès de Google avec le refresh_token
      oauth2Client.setCredentials({
        refresh_token: user.refresh_token,
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
      console.error('❌ Erreur lors de la récupération des écoutes:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des écoutes' });
    }
  };
  
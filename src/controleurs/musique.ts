import MusiqueService, {Musique} from "../database/musiqueService";
import { Request, Response } from "express";
import UtilisateurService, { Utilisateur } from "../database/utilisateurService";

export const addMusic = async (req : Request, res : Response) : Promise<void> => {
    const musiqueService : MusiqueService = new MusiqueService();
    try {
        let music : Musique = req.body;
        const user : Omit<Utilisateur, "password"> = (req as any).user;
        music.id_utilisateur = user.id as number;
        const musicsUser : Musique[] = await musiqueService.getMusicsByUserId(user.id as number);
        if (musicsUser.length >= 5) {
            res.status(401).json({
                "message" : "Vous ne pouvez pas ajouter plus de 5 musiques"
            });
            return;
        }
        await musiqueService.addMusic(music);
        res.status(200).json({
            "message" : "Musique bien ajoutée",
            "musique" : music,
            "utilisateur" : user,
            "musiques" : musicsUser
        });
    } catch (error) {res.status(401).json(error);}
}

export const getMusic = async (req : Request, res : Response) : Promise<void> => {
    const musiqueService : MusiqueService = new MusiqueService();
    try {
        const user : Omit<Utilisateur, "password"> = (req as any).user;
        const musics : Musique[] = await musiqueService.getMusicsByUserId(user.id as number);
        res.status(200).json({
            "message" : `Liste des musiques de l'utilisateur : ${user.id}`,
            "musiques" : musics,
            "utilisateur" : user
        });
    } catch (error) {res.status(401).json(error);}
}

export const deleteMusic = async (req : Request, res : Response) : Promise<void> => {
    const musiqueService : MusiqueService = new MusiqueService();
    try {
        const user : Omit<Utilisateur, "password"> = (req as any).user;
        const idUser : number = user.id as number;
        const idMusic : number = parseInt(req.params.idMusic, 10);
        await musiqueService.deleteMusic(idUser, idMusic);
        const musicDelete : Musique = await musiqueService.getMusicsById(idUser, idMusic);
        res.status(200).json({
            "message" : `La musique ${idMusic} a bien été enlevé de l'utilisateur ${idUser}`,
            "musique" : musicDelete,
            "utilisateur" : user
        });
    } catch (error) {res.status(401).json(error);}
}

export const getMusicsByUserId = async (req : Request, res : Response) : Promise<void> => {
    const musiqueService : MusiqueService = new MusiqueService();
    const utilisateurService : UtilisateurService = new UtilisateurService();
    try {
        const id : number = parseInt(req.params.idUser, 10);
        const musiques : Musique[] = await musiqueService.getMusicsByUserId(id);
        const utilisateur : Omit<Utilisateur, "password"> = await utilisateurService.getUserById(id);
        res.status(200).json({
            musiques : musiques,
            utilisateur : utilisateur
        });
    } catch(error) {res.status(401).json(error);}
}
//commentaire

export const getRandomMusic = async (req : Request, res : Response) : Promise<void> => {
    const musiqueService : MusiqueService = new MusiqueService();
    try {
        const musique : Musique = await musiqueService.getRandomMusic();
        res.status(200).json({
            musique : musique
        });
    }
    catch(error) {res.status(401).json(error);}
}

export const saveTopFive = async (req: Request, res: Response): Promise<void> => {
    const musiqueService = new MusiqueService();

    try {
        const user = (req as any).user;
        const userId = user.id;
        const { topFive } = req.body;

        if (!Array.isArray(topFive)) {
            res.status(400).json({ message: "Top 5 non valide." });
            return;
        }

        await musiqueService.saveTopFive(userId, topFive);

        res.status(200).json({
            message: "Top 5 enregistré avec succès.",
        });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du Top 5 :", error);
        res.status(500).json({
            message: "Erreur interne lors de l'enregistrement du Top 5.",
        });
    }
};

export const getTopFive = async (req: Request, res: Response): Promise<void> => {
    const musiqueService = new MusiqueService();
  
    try {
      const user = (req as any).user; // Récupère l'utilisateur connecté depuis le token
      if (!user) {
        res.status(401).json({ error: "Utilisateur non authentifié." });
        return;
      }
  
      const userId = user.id;
      const topFive = await musiqueService.getTopFiveByUserId(userId); // Appelle la méthode dans le service
  
      res.status(200).json({
        message: "Top 5 récupéré avec succès.",
        topFive,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du Top 5 :", error);
      res.status(500).json({
        error: "Erreur interne lors de la récupération du Top 5.",
      });
    }
  };
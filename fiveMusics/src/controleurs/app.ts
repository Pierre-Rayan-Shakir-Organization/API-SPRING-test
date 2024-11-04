import { Request, Response } from "express";
import MusiqueService, {Musique} from "../database/musiqueService";
import { Utilisateur } from "../database/utilisateurService";

type UtilisateursEtMusiques = Omit<Utilisateur, "password"> & {music : Musique};



/*const getMusicsOfFriendsPaginated = async (req: Request, res: Response): Promise<void> => {
    const musicService: MusiqueService = new MusiqueService();
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;

    try {
        const user: Utilisateur = (req as any).user;
        const user_id: number = user.id as number;
        
        const friends: Omit<Utilisateur, "password">[] = await amisService.showFriends(user_id);
        console.log(user_id);
        const retour: UtilisateursEtMusiques[] = [];

        for (const friend of friends) {
            console.log(friend);
            const musics: Musique[] = await musicService.getMusicsByUserId(friend.id as number);
            console.log("fetch musics");
            for (const music of musics) {
                const uandm: UtilisateursEtMusiques = {
                    ...friend,
                    music
                };
                retour.push(uandm);
            }
        }

        // Mélanger la liste pour un fil d'actualité aléatoire
        const shuffledRetour = retour.sort(() => Math.random() - 0.5);

        // Pagination
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedRetour = shuffledRetour.slice(start, end);

        // Vérifier s'il y a plus de données à envoyer
        const hasMore = end < shuffledRetour.length;

        res.status(200).json({ data: paginatedRetour, hasMore });  // Envoie la réponse paginée au client
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the music of friends.' });
    }
};

export { getMusicsOfFriendsPaginated }; */

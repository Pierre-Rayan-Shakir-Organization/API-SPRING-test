import { pool } from "./pool";

export interface Musique {
    id? : number,
    id_utilisateur : number | null,
    artiste : string,
    titre : string,
    url_preview : string,
    url_cover_album_big : string
}

interface UtilisateurSpecial {
    id? : number,
    prenom : string,
    nom : string
}

type MusiqueAndUtilisateur  = Musique & UtilisateurSpecial;

/*
    ajouter une musique -> void,
    retirer une musique -> void,
    afficher les musiques d'un utilisateur -> Musique[]
*/

export default class MusiqueService {

    async addMusic(music : Musique) : Promise<void> {
        const query : string = `
            INSERT INTO musique (id_utilisateur, artiste, titre, url_preview, url_cover_album_big) 
            VALUES (?, ?, ?, ?, ?)
        `;
        try {
            await pool.execute(query, [music.id_utilisateur, music.artiste, music.titre, music.url_preview, music.url_cover_album_big]);
        } catch(error) {throw error;}
    }

    async deleteMusic(id_utilisateur : number, id : number) : Promise<void> {
        const query : string = `
            DELETE FROM musique 
            WHERE id = ? AND id_utilisateur = ?
        `;
        try {
            await pool.execute(query, [id, id_utilisateur]);
        } catch(error) {throw error;}
    }

    async getMusicsByUserId(user_id : number) : Promise<Musique[]> {
        const query : string = `
            SELECT * FROM musique
            WHERE id_utilisateur = ?
        `;
        try {
            const [result] : [any[], any] = await pool.execute(query, [user_id]);
            return result as Musique[];
        } catch(error) {throw error;}
    }

    async getMusicsById(user_id : number, music_id : number) : Promise<Musique> {
        const query : string = `
            SELECT * FROM musique
            WHERE id_utilisateur = ? AND id = ?
        `;
        try {
            const [result] : [any[], any] = await pool.execute(query, [user_id, music_id]);
            return result[0] as Musique;
        } catch(error) {throw error;}
    }

    async getRandomMusic() : Promise<MusiqueAndUtilisateur> {
        const query : string = `
            SELECT 
                m.id AS musique_id, 
                m.id_utilisateur, 
                m.artiste, 
                m.titre,
                m.url_preview,
                m.url_cover_album_big, 
                u.prenom, 
                u.nom
            FROM 
                musique m
            JOIN 
                utilisateur u ON m.id_utilisateur = u.id
            ORDER BY 
                RAND()
            LIMIT 1;
        `
        try {
            const [result] : [any[], any] = await pool.execute(query);
            return result[0] as MusiqueAndUtilisateur;
        } catch(error) {throw error;}
    }

}
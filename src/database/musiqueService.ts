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
    async saveTopFive(userId: number, topFive: any[]): Promise<void> {
        const deleteQuery = `
            DELETE FROM top_five WHERE id_utilisateur = ?
        `;
        const insertQuery = `
            INSERT INTO top_five (id_utilisateur, id_musique, ordre) 
            VALUES (?, ?, ?)
        `;
        const connection = await pool.getConnection();
    
        try {
            // Supprimez les anciens enregistrements
            await connection.execute(deleteQuery, [userId]);
    
            // Ajoutez les nouveaux enregistrements
            const insertPromises = topFive
                .filter((music) => music !== null) // Exclut les emplacements vides
                .map((music, index) =>
                    connection.execute(insertQuery, [userId, music.id, index])
                );
            await Promise.all(insertPromises);
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
    async getTopFiveByUserId(userId: number): Promise<any[]> {
        const query = `
          SELECT 
            m.id AS musique_id, 
            m.id_utilisateur, 
            m.artiste, 
            m.titre, 
            m.url_preview, 
            m.url_cover_album_big, 
            tf.ordre
          FROM 
            top_five tf
          JOIN 
            musique m ON tf.id_musique = m.id
          WHERE 
            tf.id_utilisateur = ?
          ORDER BY 
            tf.ordre ASC;
        `;
      
        try {
          const [result] = await pool.execute(query, [userId]);
          return result as any[]; // Retourne les musiques du Top 5 avec l'ordre
        } catch (error) {
          throw error;
        }
      }

}
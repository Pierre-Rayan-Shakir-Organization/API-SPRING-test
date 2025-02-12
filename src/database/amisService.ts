import { pool } from "./pool";
import { Utilisateur } from "./utilisateurService";

export default class AmisService {

    // 📌 Envoyer une demande d'ami
    async envoyerDemande(amiId: number, userId: number): Promise<boolean> {
        const query = `
            INSERT INTO Amis (utilisateur1_id, utilisateur2_id, statut)
            VALUES (?, ?, 'pending');
        `;

        try {
            const [result]: any = await pool.execute(query, [userId, amiId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("❌ Erreur SQL envoyerDemande :", error);
            throw error;
        }
    }

    // 📌 Accepter une demande d'ami
    async accepterDemande(amiId: number, userId: number): Promise<boolean> {
        const query = `
            UPDATE Amis
            SET statut = 'accepted'
            WHERE utilisateur1_id = ? AND utilisateur2_id = ? AND statut = 'pending';
        `;

        try {
            const [result]: any = await pool.execute(query, [amiId, userId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("❌ Erreur SQL accepterDemande :", error);
            throw error;
        }
    }

    // 📌 Supprimer un ami ou annuler une demande
    async supprimerAmi(amiId: number, userId: number): Promise<boolean> {
        const query = `
            DELETE FROM Amis
            WHERE (utilisateur1_id = ? AND utilisateur2_id = ?) 
               OR (utilisateur1_id = ? AND utilisateur2_id = ?);
        `;

        try {
            const [result]: any = await pool.execute(query, [userId, amiId, amiId, userId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("❌ Erreur SQL supprimerAmi :", error);
            throw error;
        }
    }

    // 📌 Récupérer la liste des amis
    async getAmis(userId: number): Promise<any[]> {
        const query = `
            SELECT u.id, u.prenom, u.nom, u.email
            FROM Amis a
            JOIN utilisateur u ON (u.id = a.utilisateur1_id OR u.id = a.utilisateur2_id)
            WHERE (a.utilisateur1_id = ? OR a.utilisateur2_id = ?) AND a.statut = 'accepted'
              AND u.id != ?;
        `;

        try {
            const [result]: [any[], any] = await pool.execute(query, [userId, userId, userId]);
            return result;
        } catch (error) {
            console.error("❌ Erreur SQL getAmis :", error);
            throw error;
        }
    }

    // 📌 Obtenir les demandes d'amis reçues
    async getDemandesRecues(userId: number): Promise<any[]> {
        const query = `
            SELECT u.id, u.prenom, u.nom, u.email
            FROM Amis a
            JOIN utilisateur u ON u.id = a.utilisateur1_id
            WHERE a.utilisateur2_id = ? AND a.statut = 'pending';
        `;

        try {
            const [result]: [any[], any] = await pool.execute(query, [userId]);
            return result;
        } catch (error) {
            console.error("❌ Erreur SQL getDemandesRecues :", error);
            throw error;
        }
    }

    // 📌 Obtenir les demandes d'amis envoyées
    async getDemandesEnvoyees(userId: number): Promise<any[]> {
        const query = `
            SELECT u.id, u.prenom, u.nom, u.email
            FROM Amis a
            JOIN utilisateur u ON u.id = a.utilisateur2_id
            WHERE a.utilisateur1_id = ? AND a.statut = 'pending';
        `;

        try {
            const [result]: [any[], any] = await pool.execute(query, [userId]);
            return result;
        } catch (error) {
            console.error("❌ Erreur SQL getDemandesEnvoyees :", error);
            throw error;
        }
    }

    // 📌 Compter le nombre d'amis
    async countAmis(userId: number): Promise<number> {
        const query = `
            SELECT COUNT(*) AS count
            FROM Amis
            WHERE (utilisateur1_id = ? OR utilisateur2_id = ?) AND statut = 'accepted';
        `;

        try {
            const [result]: [any[], any] = await pool.execute(query, [userId, userId]);
            return result[0].count;
        } catch (error) {
            console.error("❌ Erreur SQL countAmis :", error);
            throw error;
        }
    }

// 📌 Rechercher un utilisateur par prénom et nom exacts
async searchUser(userId: number, prenom: string, nom: string): Promise<any[]> {
    const query = `
        SELECT 
    u.id,
    u.prenom,
    u.nom,
    u.email,
    u.sexe,
    CASE 
        WHEN a1.utilisateur1_id IS NOT NULL AND a2.utilisateur2_id IS NOT NULL THEN 'friends'
        WHEN a1.utilisateur1_id IS NOT NULL THEN 'pending'
        WHEN a2.utilisateur1_id IS NOT NULL THEN 'requested'
        ELSE 'not_friends'
    END AS friendship_status
FROM 
    utilisateur u
LEFT JOIN 
    Amis a1 ON a1.utilisateur1_id = ? AND a1.utilisateur2_id = u.id AND a1.statut = 'pending'
LEFT JOIN 
    Amis a2 ON a2.utilisateur1_id = u.id AND a2.utilisateur2_id = ? AND a2.statut = 'pending'
WHERE 
    u.id != ? 
    AND LOWER(CONCAT(u.prenom, ' ', u.nom)) = LOWER(?)
ORDER BY 
    u.id ASC -- Assure un ordre fixe basé sur l'ID
LIMIT 1;


    `;

    try {
        const [result]: [any[], any] = await pool.execute(query, [
            userId, userId, userId, prenom, nom
        ]);
        return result;
    } catch (error) {
        console.error("❌ Erreur SQL dans searchUser :", error);
        throw error;
    }
}


}

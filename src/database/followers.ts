import { pool } from "./pool";
import { Utilisateur } from "./utilisateurService";

type status = 'pending' | 'accepted';

export interface Followers {
    followerId : number,
    followingId : number,
    status : status
}

// Followers(follower_id, following_id) (1, 2)
// 1 suit 2

export default class FollowersService {

    // On cherche à vérifier si le follower suit bien le following
    async verifyIfFollow(followerId : number, followingId : number) : Promise<boolean> {
        const query = 
            `SELECT COUNT(*) as count
            FROM Followers
            WHERE follower_id = ? AND following_id = ? AND status = 'accepted'
        ;`
        try {
            const [result] : [any[], any] = await pool.execute(query, [followerId, followingId]);
            return result[0].count > 0;
        } catch(error) {throw error;}
    }

    // follow un utilisateur
    async followUser(followerId: number, followingId: number): Promise<boolean> {
        if (!Number.isInteger(followerId) || !Number.isInteger(followingId)) {
            throw new Error("Les IDs doivent être des entiers valides.");
        }
    
        const query = `
            INSERT INTO Followers (follower_id, following_id, status)
            VALUES (?, ?, 'pending')
            ON DUPLICATE KEY UPDATE status = 'pending';
        ;`;
    
        try {
            const [result]: any = await pool.execute(query, [followerId, followingId]);
            return result.affectedRows > 0; // Retourne true si une nouvelle relation a été créée
        } catch (error) {
            console.error("Erreur lors du follow :", error);
            throw error;
        }
    }
    

    // unfollow un utilisateur
    async unfollowUser(followerId : number, followingId : number) : Promise<void> {
        const query : string = 
            `DELETE FROM Followers
            WHERE follower_id = ? AND following_id = ?
        ;`
        try {
            await pool.execute(query, [followerId, followingId]);
        } catch (error) {throw error;}
    }

    // accept une demande de follow
    async acceptFollow(followerId: number, followingId: number): Promise<boolean> {
        if (!Number.isInteger(followerId) || !Number.isInteger(followingId)) {
            throw new Error('Les IDs doivent être des entiers valides.');
        }
    
        const query: string = `
            UPDATE Followers
            SET status = 'accepted'
            WHERE follower_id = ? AND following_id = ? AND status = 'pending'
        ;`;
    
        try {
            const [result]: any = await pool.execute(query, [followerId, followingId]);
            return result.affectedRows > 0; // Retourne true si une ligne a été mise à jour, false sinon
        } catch (error) {
            console.error(`Erreur lors de l'acceptation du follow :`, error);
            throw error;
        }
    }
    

    // refuser une demande de follow
    async rejectFollowRequest(followerId : number, followingId : number) : Promise<void> {
        const query : string  = 
            `DELETE FROM Followers
            WHERE follower_id = ? AND following_id = ? AND status = 'pending'
        ;`
        try {await pool.execute(query, [followerId, followingId]);}
        catch (error) {throw error;}
    }

    // get liste de followers
    async getFollowers(userId: number): Promise<any[]> {
        const query = `
            SELECT 
                u.id,
                u.prenom,
                u.nom,
                u.email,
                u.sexe,
                CASE 
    WHEN f1.follower_id IS NOT NULL AND f2.follower_id IS NOT NULL THEN 'friends'
    WHEN f2.follower_id IS NOT NULL THEN 'followed_by'
    WHEN f1.follower_id IS NOT NULL THEN 'following'
    ELSE 'not_following'
END AS friendship_status

            FROM 
                Followers f
            JOIN 
                utilisateur u ON f.follower_id = u.id
            LEFT JOIN 
                Followers f1 ON f1.follower_id = ? AND f1.following_id = u.id AND f1.status = 'accepted'
            LEFT JOIN 
                Followers f2 ON f2.follower_id = u.id AND f2.following_id = ? AND f2.status = 'accepted'
            WHERE 
                f.following_id = ? AND f.status = 'accepted';
        `;
    
        try {
            const [result]: [any[], any] = await pool.execute(query, [userId, userId, userId]);
            console.log("✅ Résultat getFollowers :", result);
            console.log("✅ Résultat getFollowers :", JSON.stringify(result, null, 2));

            
            // Vérifier si c'est un tableau avant de renvoyer
            return Array.isArray(result) ? result : [];
        } catch (error) {
            console.error("❌ Erreur SQL dans getFollowers :", error);
            throw error;
        }
    }
    
    
    
    

    // get liste de following
    async getFollowing(userId : number) : Promise<Omit<Utilisateur, "password">[]> {
        const query = 
            `SELECT 
                u.prenom,
                u.nom,
                u.email,
                u.sexe
            FROM Followers
            JOIN utilisateur u ON Followers.following_id = u.id
            WHERE Followers.follower_id = ? AND Followers.status = 'accepted'
        ;`
        try {
            const [users] : [any[], any] = await pool.execute(query, [userId]);
            return users as Utilisateur[];
        } catch(error) {throw error;}
    }

    // liste des follow en pending
    async getFollowPending(userId: number): Promise<any[]> {
        const query = `
            SELECT 
                u.id,  -- ✅ Ajout de la virgule ici
                u.prenom,
                u.nom,
                u.email,
                u.sexe
            FROM Followers
            JOIN utilisateur u ON Followers.follower_id = u.id
            WHERE Followers.following_id = ? AND Followers.status = 'pending';
        `;
    
        try {
            const [result]: [any[], any] = await pool.execute(query, [userId]);
            return result;
        } catch (error) {
            console.error("❌ Erreur SQL dans getFollowPending :", error);
            throw error;
        }
    }
    
    

    // Récupérer les follow en attente envoyés par l'utilisateur
async getFollowersPending(userId: number): Promise<any[]> {
    const query = `
    SELECT 
        u.id,
        u.prenom,
        u.nom,
        u.email,
        u.sexe
    FROM Followers f
    JOIN utilisateur u ON f.follower_id = u.id
    WHERE f.following_id = ? AND f.status = 'pending';
`;



    try {
        const [result]: [any[], any] = await pool.execute(query, [userId]);
        return result;
    } catch (error) {
        console.error("❌ Erreur SQL dans getFollowersPending :", error);
        throw error;
    }
}


    // compter le nomber de followers d'un utilisateur
    async countFollowers(userId: number): Promise<number> {
        const query = 
            `SELECT COUNT(*) as count
            FROM Followers
            WHERE following_id = ? AND status = 'accepted'
        ;`
        try {
            const [result]: [any[], any] = await pool.execute(query, [userId]);
            return result[0].count;
        } catch (error) {
            console.error('Error counting followers:', error);
            throw error;
        }
    }

    // compter le nombre de following d'un utilisateur
    async countFollowing(userId: number): Promise<number> {
        const query = `
            SELECT COUNT(*) as count
            FROM Followers
            WHERE follower_id = ? AND status = 'accepted'
        ;`;
    
        try {
            const [result]: [any[], any] = await pool.execute(query, [userId]);
            return result[0].count;
        } catch (error) {
            console.error("Erreur lors du comptage des followings :", error);
            throw error;
        }
    }
    

    // recherche des utilisateurs
    async recherche(userId: number, prenom: string, nom: string): Promise<any[]> {
        const searchPrenom = `%${prenom}%`;
        const searchNom = `%${nom}%`;
    
        const query = `
            SELECT 
                u.id,
                u.prenom,
                u.nom,
                u.email,
                u.sexe,
                CASE 
                    WHEN f1.follower_id IS NOT NULL AND f2.follower_id IS NOT NULL THEN 'friends'  -- ✅ Ajout du cas "Amis"
                    WHEN f1.follower_id IS NOT NULL THEN 'following'  -- ✅ Rayan suit Shakir
                    WHEN f2.follower_id IS NOT NULL THEN 'followed_by'  -- ✅ Shakir suit Rayan
                    ELSE 'not_following'
                END AS friendship_status
            FROM 
                utilisateur u
            LEFT JOIN 
                Followers f1 ON f1.follower_id = ? AND f1.following_id = u.id AND f1.status = 'accepted'
            LEFT JOIN 
                Followers f2 ON f2.follower_id = u.id AND f2.following_id = ? AND f2.status = 'accepted'
            WHERE 
                u.id != ?
                AND (u.prenom LIKE ? OR u.nom LIKE ?)
            ORDER BY 
                u.nom ASC, u.prenom ASC
            LIMIT 20;
        `;
    
        try {
            const [result]: [any[], any] = await pool.execute(query, [
                userId, userId, userId, searchPrenom, searchNom
            ]);
            return result;
        } catch (error) {
            console.error("❌ Erreur SQL dans recherche :", error);
            throw error;
        }
    }
    
    
    

}
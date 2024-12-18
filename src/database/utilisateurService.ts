import { pool } from "./pool";

type sexe = "M" | "F"

export interface Utilisateur {
    id?: number;
    prenom: string;
    nom: string;
    email: string;
    password: string;
    sexe: "M" | "F";
    date?: string;
    description?: string;      
    photo_profil?: string;     
}


export interface UtilisateurConnexion {
    email : string,
    password : string
}



/* 
    create user -> void,
    get userByID -> Utilisateur,
    get userByEmail -> Utilisateur,
    verify email -> boolean,
    verify password -> boolean
*/
export default class UtilisateurService {

    async createUser(user: Utilisateur): Promise<void> {
        const query = `
            INSERT INTO utilisateur (prenom, nom, email, password, sexe, description, photo_profil)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            await pool.execute(query, [
                user.prenom,
                user.nom,
                user.email,
                user.password,
                user.sexe,
                user.description || null,
                user.photo_profil || null
            ]);
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id: number): Promise<Omit<Utilisateur, "password">> {
        const query: string = `
            SELECT id, prenom, nom, email, sexe, date_inscription, description, photo_profil 
            FROM utilisateur 
            WHERE id = ?
        `;
        try {
            const [result]: [any[], any] = await pool.execute(query, [id]);
            return result[0] as Omit<Utilisateur, "password">;
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<Omit<Utilisateur, "password">> {
        const query: string = `
            SELECT id, prenom, nom, email, sexe, date_inscription, description, photo_profil 
            FROM utilisateur 
            WHERE email = ?
        `;
        try {
            const [result]: [any[], any] = await pool.execute(query, [email]);
            return result[0] as Omit<Utilisateur, "password">;
        } catch (error) {
            throw error;
        }
    }

    async verifyEmail(email : string) : Promise<boolean> {
        const query : string = "SELECT email FROM utilisateur WHERE email = ?";
        try {
            const [result] : [any[], any] = await pool.execute(query, [email]);
            if (result.length > 0) {return true;}
            return false;
        } catch (error) {throw error;}
    }

    async verifyPassword(email : string, password : string) : Promise<boolean> {
        const query : string = "SELECT password FROM utilisateur WHERE email = ?";
        try {
            const [result] : [any[], any] = await pool.execute(query, [email]);
            if (result.length > 0) {
                if (password === result[0].password as string) {return true;}
            }
            return false;
        } catch (error) {throw error;}
    }

    async getAllUsers() : Promise<Omit<Utilisateur, "password">[]> {
        const query : string = `SELECT id, prenom, nom, email, sexe, date_inscription FROM utilisateur`;
        const [users] : [any[], any] = await pool.execute(query);
        return users as Omit<Utilisateur, "password">[];
    }

    async deleteUser(id : number) : Promise<void> {
        const query : string = `DELETE FROM utilisateur WHERE id = ?`;
        try {
            await pool.execute(query, [id]);
        } catch (error) {throw error;}
    }

    async getAllOtherUsers(id: number) : Promise<Omit<Utilisateur, "password">[]> {
        const query : string = `
            SELECT id, prenom, nom, email, sexe, date_inscription FROM utilisateur
            WHERE id <> ?
        `;
        try {
            const users : [any[], any] =  await pool.execute(query, [id]);
            return users as Omit<Utilisateur, "password">[];
        } catch(error) {throw error;}
    }
    async updateProfile(id: number, user: any): Promise<void> {
        const query = `
            UPDATE utilisateur
            SET prenom = ?, nom = ?, email = ?, sexe = ?, description = ?, photo_profil = ?
            WHERE id = ?
        `;
        await pool.execute(query, [
            user.prenom, user.nom, user.email, user.sexe, user.description, user.photo_profil, id
        ]);
    }

}
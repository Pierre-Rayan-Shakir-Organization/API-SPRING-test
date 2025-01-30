import { Request, Response } from "express";
import AmisService from "../database/amisService";
import { Utilisateur } from "../database/utilisateurService";

const amisService = new AmisService();

/**
 * 📌 Envoyer une demande d'ami
 */
export const envoyerDemande = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        const amiId = parseInt(req.params.amiId, 10);

        if (!amiId || isNaN(amiId)) {
            return res.status(400).json({ error: "ID d'ami invalide." });
        }

        await amisService.envoyerDemande(amiId, user.id as number);
        return res.status(200).json({ message: `Demande d'ami envoyée à l'utilisateur ${amiId}.` });
    } catch (error) {
        console.error("❌ Erreur envoyerDemande :", error);
        return res.status(500).json({ error: "Erreur lors de l'envoi de la demande d'ami." });
    }
};



/**
 * 📌 Accepter une demande d'ami reçue
 */
export const accepterDemande = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        const amiId = parseInt(req.params.amiId, 10);

        if (!amiId || isNaN(amiId)) {
            return res.status(400).json({ error: "ID d'ami invalide." });
        }

        await amisService.accepterDemande(amiId, user.id as number);
        return res.status(200).json({ message: `Demande d'ami acceptée avec l'utilisateur ${amiId}.` });
    } catch (error) {
        console.error("❌ Erreur accepterDemande :", error);
        return res.status(500).json({ error: "Erreur lors de l'acceptation de la demande d'ami." });
    }
};



/**
 * 📌 Supprimer un ami
 */
export const supprimerAmi = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        const amiId = parseInt(req.params.amiId, 10);

        if (!amiId || isNaN(amiId)) {
            return res.status(400).json({ error: "ID d'ami invalide." });
        }

        await amisService.supprimerAmi(amiId, user.id as number);
        return res.status(200).json({ message: `Ami supprimé avec l'utilisateur ${amiId}.` });
    } catch (error) {
        console.error("❌ Erreur supprimerAmi :", error);
        return res.status(500).json({ error: "Erreur lors de la suppression de l'ami." });
    }
};

/**
 * 📌 Obtenir la liste des amis
 */
export const getAmis = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        console.log("👤 Requête reçue pour récupérer les amis de l'utilisateur :", user);

        if (!user.id) {
            console.error("❌ Erreur : ID utilisateur introuvable !");
            return res.status(400).json({ error: "ID utilisateur introuvable" });
        }

        const amis = await amisService.getAmis(user.id as number);
        console.log("✅ Amis trouvés :", amis);

        return res.status(200).json(amis);
    } catch (error) {
        console.error("❌ Erreur getAmis :", error);
        return res.status(500).json({ error: "Erreur lors de la récupération de la liste des amis." });
    }
};


/**
 * 📌 Obtenir les demandes d'amis reçues
 */
export const getDemandesRecues = async (req: Request, res: Response): Promise<Response> => {
    try {
        console.log("📩 Requête reçue pour récupérer les demandes d'amis reçues.");
        
        // Récupération de l'utilisateur connecté
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        console.log("👤 Utilisateur connecté :", user.id);

        // Récupération des demandes d'amis reçues
        const demandesRecues = await amisService.getDemandesRecues(user.id as number);
        console.log("✅ Demandes reçues récupérées :", demandesRecues);

        return res.status(200).json({ demandesRecues });

    } catch (error) {
        console.error("❌ Erreur getDemandesRecues :", error);
        
        return res.status(500).json({ 
            error: "Erreur lors de la récupération des demandes d'amis reçues.",
            details: error instanceof Error ? error.message : error
        });
    }
};


/**
 * 📌 Obtenir les demandes d'amis envoyées
 */
export const getDemandesEnvoyees = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        const demandesEnvoyees = await amisService.getDemandesEnvoyees(user.id as number);
        return res.status(200).json({ demandesEnvoyees });
    } catch (error) {
        console.error("❌ Erreur getDemandesEnvoyees :", error);
        return res.status(500).json({ error: "Erreur lors de la récupération des demandes d'amis envoyées." });
    }
};

/**
 * 📌 Compter le nombre d'amis
 */
export const countAmis = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        const nombreAmis = await amisService.countAmis(user.id as number);
        return res.status(200).json({ nombreAmis });
    } catch (error) {
        console.error("❌ Erreur countAmis :", error);
        return res.status(500).json({ error: "Erreur lors du comptage des amis." });
    }
};


// 📌 Rechercher un utilisateur par prénom et nom exacts
export const searchUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user: Omit<Utilisateur, "password"> = (req as any).user;
        const { prenom, nom } = req.query;

        if (!prenom || !nom) {
            return res.status(400).json({ error: "Le prénom et le nom sont requis pour la recherche." });
        }

        console.log("🔍 Recherche API reçue:", { userId: user.id, prenom, nom });

        const results = await amisService.searchUser(user.id as number, prenom as string, nom as string);
        
        console.log("✅ Résultats API renvoyés :", results);
        return res.status(200).json({ results });
    } catch (error) {
        console.error("❌ Erreur API searchUser:", error);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
};



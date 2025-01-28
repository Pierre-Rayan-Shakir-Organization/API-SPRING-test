import MusiqueService from '../database/musiqueService';

describe('MusiqueService - getTopFiveByUserId', () => {
  const musicService = new MusiqueService();

  it('devrait récupérer le Top 5 pour un utilisateur', async () => {
    const userId = 4; // ID utilisateur existant (Dave Brown)

    try {
      const topFive = await musicService.getTopFiveByUserId(userId);
      console.log(`Le Top 5 de l'utilisateur ${userId} est :`, topFive);

      // Vérifie qu'il y a bien 5 musiques dans le Top 5
      expect(topFive).toHaveLength(5);

      // Vérifie que les musiques récupérées correspondent aux musiques insérées
      expect(topFive).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ musique_id: 1, titre: 'Get Lucky', artiste: 'Daft Punk' }),
          expect.objectContaining({ musique_id: 3, titre: 'Blinding Lights', artiste: 'The Weeknd' }),
          expect.objectContaining({ musique_id: 5, titre: 'Bohemian Rhapsody', artiste: 'Queen' }),
          expect.objectContaining({ musique_id: 7, titre: 'Time', artiste: 'Hans Zimmer' }),
          expect.objectContaining({ musique_id: 9, titre: 'Bad Guy', artiste: 'Billie Eilish' }),
        ])
      );
    } catch (error) {
      console.error(`Erreur lors de la récupération du Top 5 pour l'utilisateur ${userId} :`, error);
      throw error; // Propager l'erreur pour Jest
    }
  });
});

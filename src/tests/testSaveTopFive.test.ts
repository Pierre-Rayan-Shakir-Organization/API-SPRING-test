import MusiqueService from '../database/musiqueService';

describe('MusiqueService - saveTopFive', () => {
  const musicService = new MusiqueService();

  it('devrait enregistrer le Top 5 pour un utilisateur', async () => {
    const userId = 4; // ID utilisateur existant (Dave Brown)
    const topFiveExample = [
      { id: 1 }, // Daft Punk - Get Lucky
      { id: 3 }, // The Weeknd - Blinding Lights
      { id: 5 }, // Queen - Bohemian Rhapsody
      { id: 7 }, // Hans Zimmer - Time
      { id: 9 }, // Billie Eilish - Bad Guy
    ];

    try {
      await musicService.saveTopFive(userId, topFiveExample);
      console.log(`Top 5 enregistré pour l'utilisateur ${userId}`);
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement du Top 5 pour l'utilisateur ${userId} :`, error);
      throw error; // Propager l'erreur pour Jest
    }
  });
});

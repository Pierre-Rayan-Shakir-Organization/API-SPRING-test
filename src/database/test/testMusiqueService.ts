import MusiqueService, {Musique} from "../musiqueService";

const testAddMusic = async (music : Musique) : Promise<void> => {
    const musicService : MusiqueService = new MusiqueService();
    try {
        await musicService.addMusic(music);
        console.log(`la musique a bien été ajoutée`);
    } catch(error) {console.log(error);}
}

const testDeleteMusic = async (user_id: number, id : number) : Promise<void> => {
    const musicService : MusiqueService = new MusiqueService();
    try {
        await musicService.deleteMusic(user_id, id);
        console.log(`la musique ${id} a bien été supprimée`);
    } catch(error) {console.log(error);}
}

const testGetMusicsByUserId = async (user_id : number) : Promise<void> => {
    const musicService : MusiqueService = new MusiqueService();
    try {
        const musiques : Musique[] = await musicService.getMusicsByUserId(user_id);
        console.log(musiques);
    } catch(error) {console.log(error);}
}

const music : Musique = {
    id_utilisateur : 4,
    artiste : "future",
    titre : "jealous",
    url_preview : "dzsdzsd",
    url_cover_album_big : "dzsdcq"
}

// testAddMusic(music);
// testDeleteMusic(4, 3);
testGetMusicsByUserId(8);
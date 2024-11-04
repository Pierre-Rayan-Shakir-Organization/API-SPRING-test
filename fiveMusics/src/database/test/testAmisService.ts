import AmisService, {Amis} from "../amisService";
import { Utilisateur } from "../utilisateurService";

const testAddFriendship = async (user_id : number, friend_id : number) : Promise<void> => {
    const amisService : AmisService = new AmisService();
    try {
        await amisService.addFriendship(user_id, friend_id);
        console.log(`${user_id} et ${friend_id} sont devenus amis`);
    } catch(error) {console.log(error);}
}

const testDeleteFriendship = async (user_id : number, friend_id : number) : Promise<void> => {
    const amisService : AmisService = new AmisService();
    try {
        await amisService.deleteFriendship(user_id, friend_id);
        console.log(`${user_id} et ${friend_id} ne sont plus amis`);
    } catch (error) {console.log(error);}
}

const testShowFriends = async (user_id : number) : Promise<void> => {
    const amisService : AmisService = new AmisService();
    try {
        const users : Omit<Utilisateur, "password">[] = await amisService.showFriends(user_id);
        console.log(users);
    } catch(error) {console.log(error);}
}

// testAddFriendship(1, 4);
// testDeleteFriendship(1, 4);
// testShowFriends(1);
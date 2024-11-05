import UtilisateurService, {Utilisateur} from "../utilisateurService";

// Création d'utilisateur createUser
const testCreateUser = async (user: Utilisateur) : Promise<void> => {
    const userService : UtilisateurService = new UtilisateurService();
    try {
        await userService.createUser(user);
    } catch (error) {console.log(error);}
}

// Récupération d'un utilisateur à partir de son ID getUserById
const testGetUserById = async (id : number) : Promise<void> => {
    const userService : UtilisateurService = new UtilisateurService();
    try {
        const user : Omit<Utilisateur, "password"> = await userService.getUserById(id);
        console.log(user);
    } catch(error) {console.log(error);}
} 

// Récupération d'un utilisateur à partir de son email getUserById
const testGetUserByEmail = async (email : string) : Promise<void> => {
    const userService : UtilisateurService = new UtilisateurService();
    try {
        const user : Omit<Utilisateur, "password"> = await userService.getUserByEmail(email);
        console.log(user);
    } catch(error) {console.log(error);}
}

// Vérification de l'email de l'utilisateur verifyEmail
const testVerifyEmail = async (email : string) : Promise<void> => {
    const userService : UtilisateurService = new UtilisateurService();
    try {
        const result : boolean = await userService.verifyEmail(email);
        console.log(result);
    } catch(error) {console.log(error);}
}

const testVerifyPassword = async (email : string, password : string) : Promise<void> => {
    const userService : UtilisateurService = new UtilisateurService();
    try {
        const result : boolean = await userService.verifyPassword(email, password);
        console.log(result);
    } catch(error) {console.log(error);}
}

const testGetAllUsers = async () : Promise<void> => {
    const utilisateurService : UtilisateurService = new UtilisateurService();
    try {
        const users : Omit<Utilisateur, "password">[] = await utilisateurService.getAllUsers();
        console.log(users);
    } catch (error) {console.log(error);}
}

const testDeleteUser = async (id : number) : Promise<void> => {
    const utilisateurService : UtilisateurService = new UtilisateurService();
    try {
        await utilisateurService.deleteUser(id);
    }
    catch(error) {console.log(error);}
}

const user : Utilisateur = {
    prenom : "prenom2",
    nom : "nom2",
    email : "test2@gmail.com",
    password : "password2",
    sexe : "F"
}

// testCreateUser(user);
// testGetUserById(8);
// testGetUserByEmail(user.email);
// testVerifyEmail("test1@gmail.sscom");
// testVerifyPassword(user.email, "password1");
// testGetAllUsers();
// testDeleteUser(1);  
import express, {Express, Request, Response, NextFunction} from 'express';
import { verifyEmailLogin, verifyEmailSingup, verifyPassword, verifyToken } from './middlewares/authentification';
import { login, signup } from './controleurs/authentification';
import { addMusic, deleteMusic, getMusic, getMusicsByUserId, getRandomMusic } from './controleurs/musique';
import cors from 'cors';
import { getAllOtherUsers, getAllUsers } from './controleurs/utilisateurs';
import morgan from 'morgan';
import bodyParser from 'body-parser'; // si vous utilisez bodyParser
import UtilisateurService from './database/utilisateurService';


const app: Express = express();
//const app = require('../server');

const PORT = 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());  // Ajout du middleware CORS
app.use(bodyParser.json()); // Exemple de middleware

app.get('/', (req: Request, res: Response): void => {
    res.status(200).json({
        "message": "Bienvenue sur l'API de FiveMusics"
    });
});

// Utilisateurs
app.get('/getUsers', async (req: Request, res: Response) => {
    const utilisateurService = new UtilisateurService();
    try {
      const users = await utilisateurService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
});

app.get('/getAllOtherUsers', verifyToken, getAllOtherUsers);

// Authentification avec middleware
app.post('/signup', verifyEmailSingup, signup);
app.post('/login', verifyEmailLogin, verifyPassword, login);

// Musique
app.post('/addMusic', verifyToken, addMusic);
app.get('/getMusic', verifyToken, getMusic);
app.delete('/deleteMusic/:idMusic', verifyToken, deleteMusic);
app.get('/getMusicsByUserId/:idUser', verifyToken, getMusicsByUserId);
app.get('/getRandomMusic', getRandomMusic);

// Middleware de gestion des erreurs
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

if (require.main === module) {
    app.listen(PORT, (): void => {
        console.log(`http://localhost:${PORT}`);
    });
}

export default app;

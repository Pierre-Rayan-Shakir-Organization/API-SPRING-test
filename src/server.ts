import express, {Express, Request, Response, NextFunction} from 'express';
import axios from 'axios';
import { verifyEmailLogin, verifyEmailSingup, verifyPassword, verifyToken } from './middlewares/authentification';
import { login, signup } from './controleurs/authentification';
import { addMusic, deleteMusic, getMusic, getMusicsByUserId, getRandomMusic } from './controleurs/musique';
import cors from 'cors';
import { getAllOtherUsers, getAllUsers } from './controleurs/utilisateurs';
import morgan from 'morgan';
import { createProfile, updateProfile, getProfile } from './controleurs/utilisateurs';
import { upload } from './middlewares/uploadMiddleware';



const app : Express = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:4000', // Domaine du frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
}));
app.get('/', (req : Request, res : Response) : void => {
    res.status(200).json({
        "message" : "Bienvenue sur l'API de FiveMusics"
    });
});

// utilisateurs
app.get('/getUsers', getAllUsers);
app.get('/getAllOtherUsers', verifyToken, getAllOtherUsers);

// auth avec middleware
app.post('/signup', verifyEmailSingup, signup);
app.post('/login', verifyEmailLogin, verifyPassword, login);


// musique
app.post('/addMusic', verifyToken, addMusic);
app.get('/getMusic', verifyToken, getMusic);
app.delete('/deleteMusic/:idMusic', verifyToken, deleteMusic);
app.get('/getMusicsByUserId/:idUser', verifyToken, getMusicsByUserId);
app.get('/getRandomMusic', getRandomMusic);

app.get('/api/deezer', async (req: Request, res: Response) => {
    console.log(req.query)
    const { endpoint } = req.query; // Récupère l'endpoint demandé
    console.log(req.query)
    if (!endpoint) {
        return res.status(400).json({ error: "Paramètre 'endpoint' manquant." });
    }

    try {
        const response = await axios.get(`https://api.deezer.com${endpoint}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Erreur lors de la requête à Deezer :", error);
        res.status(500).json({ error: "Erreur lors de la requête à Deezer." });
    }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

if (require.main === module) {
    app.listen(PORT, (): void => {
        console.log(`http://localhost:${PORT}`);
    });
}

// Créer un profil
app.post('/profile', upload.single('photo_profil'), createProfile);

// Modifier un profil (authentifié)
app.put('/profile', verifyToken, upload.single('photo_profil'), updateProfile);

// Récupérer un profil utilisateur par ID
app.get('/profile/:id', getProfile);

export default app;
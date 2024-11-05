import express, {Express, Request, Response} from 'express';
import { verifyEmailLogin, verifyEmailSingup, verifyPassword, verifyToken } from './middlewares/authentification';
import { login, signup } from './controleurs/authentification';
import { addMusic, deleteMusic, getMusic, getMusicsByUserId, getRandomMusic } from './controleurs/musique';
import cors from 'cors';
import { getAllOtherUsers, getAllUsers } from './controleurs/utilisateurs';
import morgan from 'morgan';



const app : Express = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());  // Ajout du middleware CORS

app.get('/', (req : Request, res : Response) : void => {
    res.status(200).json({
        "message" : "Bienvenue sur l'API de FiveMusics"
    });
});

// utilisateurs
app.get('/getUsers', getAllUsers);
app.get('/getAllOtherUsers', verifyToken, getAllOtherUsers);

// auth
app.post('/signup', verifyEmailSingup, signup);
app.post('/login', verifyEmailLogin, verifyPassword, login);


// musique
app.post('/addMusic', verifyToken, addMusic);
app.get('/getMusic', verifyToken, getMusic);
app.delete('/deleteMusic/:idMusic', verifyToken, deleteMusic);
app.get('/getMusicsByUserId/:idUser', verifyToken, getMusicsByUserId);
app.get('/getRandomMusic', getRandomMusic);



app.listen(PORT, () : void => {
    console.log(`http://localhost:${PORT}`);
});

import express, {Express, Request, Response} from 'express';
import cors from 'cors';
import morgan from 'morgan';


const app : Express = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());  // Ajout du middleware CORS

app.get('/', (req : Request, res : Response) : void => {
    res.status(200).json({
        "message" : "Bienvenue sur FiveMusics !"
    });
});



app.listen(PORT, () : void => {
    console.log(`http://localhost:${PORT}`);
});

// ETML
// Auteur : bulle SecDevOps
// Date : 26.03.2024
// Description : point d'entrée pour démarrer le serveur node.js de l'exercice
//               "Authentification"
//
//

// Librairies et ressources

import express from "express";
import userRoute from "./routes/User.mjs";
import authRoute from "./routes/Auth.mjs";
import { generateSalt } from './utils/generateSalt.mjs';
const app = express();

// Middleware pour la lecture des réponses formatées en json
app.use(express.json());

// Les routes
app.use('/user', userRoute);
app.use('/auth', authRoute);

// Démarrage du serveur
app.listen(8083, () => {
    console.log('Séquence authentification, server running on port 8083');
    console.log(generateSalt(50));
});
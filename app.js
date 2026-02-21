
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: [
    'https://oswood83.github.io'
  ],
  credentials: true // si tu utilises les cookies
}));

app.post('/api/logout', (req, res) => {
  res.status(200).json({ message: 'Déconnecté' });
});

// Ajoute ici d'autres routes ou middlewares si besoin

app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});


console.log('test2');// Express.js API pour upload, suppression et listing persistant des photos
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

console.log('Fichier exécuté');

const app = express();
const PORT = 4000;
const imagesDir = path.join(process.cwd(), 'images');

// Créer le dossier images s'il n'existe pas
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

// Middleware pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques (HTML, CSS, JS, images)
app.use(express.static(process.cwd()));
app.use('/images', express.static(imagesDir));

// Multer pour upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imagesDir);
    },
    filename: (req, file, cb) => {
        // Préfixe timestamp pour éviter les doublons
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// Liste des images
app.get('/api/list-images', (req, res) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov'];
    const imagesList = [];
    // Lire le dossier images
    fs.readdir(imagesDir, (err, files) => {
        if (!err && files) {
            files.filter(f => allowed.includes(path.extname(f).toLowerCase()))
                .forEach(f => imagesList.push('images/' + f));
        }
        // Lire le dossier img-photographie
        const imgPhotographieDir = path.join(process.cwd(), 'img-photographie');
        fs.readdir(imgPhotographieDir, (err2, files2) => {
            if (!err2 && files2) {
                files2.filter(f => allowed.includes(path.extname(f).toLowerCase()))
                    .forEach(f => imagesList.push('img-photographie/' + f));
            }
            // Retourner la liste combinée
            res.json({ images: imagesList });
        });
    });
});

// Upload d'une image
app.post('/api/photos', upload.single('photo'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' });
    // Retourner infos pour le client
    res.json({
        photo: {
            id: Date.now(),
            filename: req.file.filename,
            title: req.body.title || req.file.originalname,
            category: req.body.category || 'photo'
        }
    });
});

// Suppression d'une image
app.delete('/api/photos', (req, res) => {
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ error: 'Nom de fichier manquant' });
    const filePath = path.join(imagesDir, filename);
    fs.unlink(filePath, err => {
        if (err) return res.status(404).json({ error: 'Fichier non trouvé' });
        res.json({ success: true });
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur galerie démarré sur http://localhost:${PORT}`);
    console.log('Le script démarre bien');
});

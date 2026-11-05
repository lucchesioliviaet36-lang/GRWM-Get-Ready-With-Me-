const multer = require('multer');
const path = require('path');
const fs = require('fs');

const carpetaHistorias = path.join(__dirname, '../uploads/historias');

if (!fs.existsSync(carpetaHistorias)) {
    fs.mkdirSync(carpetaHistorias, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, carpetaHistorias);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const nombreArchivo = `historia-${Date.now()}-${Math.round(Math.random() * 1000000)}${extension}`;
        cb(null, nombreArchivo);
    }
});

const filtroArchivos = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes para historias'), false);
    }
};

const uploadHistoria = multer({
    storage,
    fileFilter: filtroArchivos,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

module.exports = uploadHistoria;

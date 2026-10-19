const multer = require("multer");
const path = require("path");
const fs = require("fs");

const carpetaUploads = path.join(__dirname, "../uploads/prendas");

if (!fs.existsSync(carpetaUploads)) {
    fs.mkdirSync(carpetaUploads, {recursive: true});
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, carpetaUploads);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const nombreArchivo = `prenda-${Date.now()}-${Math.round(Math.random() * 1000000)}${extension}`;

        cb(null, nombreArchivo);
    }
});

const filtroArchivos = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten imágenes"), false);
    }
};

const uploadPrenda = multer({
    storage,
    fileFilter: filtroArchivos,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = uploadPrenda;
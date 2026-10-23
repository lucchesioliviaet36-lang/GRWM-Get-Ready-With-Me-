const multer = require("multer");
const path = require("path");
const fs = require("fs");

const carpetaPerfil = path.join(__dirname, "../uploads/perfiles");

if (!fs.existsSync(carpetaPerfil)) {
    fs.mkdirSync(carpetaPerfil, {recursive: true});
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, carpetaPerfil);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);

        const nombreArchivo =
            `${file.fieldname}-${req.user.id_usuario}-${Date.now()}${extension}`;

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

const uploadPerfil = multer({
    storage,
    fileFilter: filtroArchivos,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = uploadPerfil;
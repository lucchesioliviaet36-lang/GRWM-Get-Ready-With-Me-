const express = require("express");
const publicacionController = require("../controllers/publicacionController.js");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// LIKES, FAVORITOS Y COMENTARIOS
const likeController = require("../controllers/likeController.js");
const favoritoController = require("../controllers/favoritoController.js");
const comentarioController = require("../controllers/comentarioController.js");

const router = express.Router();

const carpetaPublicaciones = path.join(
    __dirname,
    "../uploads/publicaciones"
);

fs.mkdirSync(carpetaPublicaciones, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, carpetaPublicaciones);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const nombreArchivo = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        cb(null, nombreArchivo);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("El archivo debe ser una imagen"));
        }
    }
});

// 🚀 CREAR Y OBTENER PUBLICACIONES
router.post("/", upload.single("imagen"), (req, res) => {
    publicacionController.crearPublicacion(req, res);
});

router.get("/", (req, res) => {
    publicacionController.obtenerPublicaciones(req, res);
});

// --- LIKES ---
router.post("/:id_publicacion/like", (req, res) => {
    likeController.alternarLike(req, res);
});

router.get("/:id_publicacion/likes", (req, res) => {
    likeController.obtenerLikes(req, res);
});

// --- FAVORITOS ---
router.post("/:id_publicacion/favorito", (req, res) => {
    favoritoController.toggleFavorito(req, res);
});

router.get("/:id_publicacion/favorito", (req, res) => {
    favoritoController.obtenerEstadoFavorito(req, res);
});

router.get("/favoritos/usuario/:id_usuario", (req, res) => {
    favoritoController.obtenerFavoritosPorUsuario(req, res);
});

// --- COMENTARIOS ---
router.get("/:id_publicacion/comentarios", (req, res) => {
    comentarioController.obtenerComentarios(req, res);
});

router.post("/:id_publicacion/comentario", (req, res) => {
    comentarioController.crearComentario(req, res);
});

router.delete("/comentario/:id_comentario", (req, res) => {
    comentarioController.eliminarComentario(req, res);
});

// --- ELIMINAR PUBLICACIÓN ---
router.delete("/:id_publicacion", (req, res) => {
    publicacionController.eliminarPublicacion(req, res);
});

module.exports = router;
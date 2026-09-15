const express = require("express");
const publicacionController = require("../controllers/publicacionController.js");

// LIKES, FAVORITOS Y COMENTARIOS
const likeController = require("../controllers/likeController.js");
const favoritoController = require("../controllers/favoritoController.js");
const comentarioController = require("../controllers/comentarioController.js");

const router = express.Router();

// 🚀 CREAR Y OBTENER PUBLICACIONES
router.post("/", (req, res) => {
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
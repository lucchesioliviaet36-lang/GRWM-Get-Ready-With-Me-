const express = require("express");
const publicacionController = require("../controllers/publicacionController.js");

// LIKES Y FAVORITOS
const likeController = require("../controllers/likeController.js");
const favoritoController = require("../controllers/favoritoController.js");

const router = express.Router();

// 🚀 ENDPOINT PARA CREAR PUBLICACIÓN (POST http://localhost:3000/api/publicaciones)
router.post("/", (req, res) => {
    publicacionController.crearPublicacion(req, res);
});

// Obtener todas las publicaciones (GET http://localhost:3000/api/publicaciones)
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
    favoritoController.toggleFavorito(req, res); // 👈 Corregido de alternarFavorito a toggleFavorito
});

router.get("/:id_publicacion/favorito", (req, res) => {
    favoritoController.obtenerEstadoFavorito(req, res);
});

router.get("/favoritos/usuario/:id_usuario", (req, res) => {
    favoritoController.obtenerFavoritosPorUsuario(req, res); // 👈 Corregido a favoritoController
});

// --- ELIMINAR PUBLICACIÓN ---
router.delete("/:id_publicacion", (req, res) => {
    publicacionController.eliminarPublicacion(req, res);
});

module.exports = router;
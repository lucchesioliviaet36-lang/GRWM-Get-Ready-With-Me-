const express = require("express");
const publicacionController = require("../controllers/publicacionController.js");
const likeController = require("../controllers/likeController.js");

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

router.delete("/:id_publicacion", (req, res) => {
    publicacionController.eliminarPublicacion(req, res);
});

module.exports = router;
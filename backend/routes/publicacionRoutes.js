const express = require("express");
const likeController = require("../controllers/likeController.js");

const router = express.Router();

// Dar / Quitar Like (POST /api/publicaciones/:id_publicacion/like)
router.post("/:id_publicacion/like", (req, res) => {
    likeController.alternarLike(req, res);
});

// Obtener likes totales y si el usuario actual le dio me gusta (GET /api/publicaciones/:id_publicacion/likes)
router.get("/:id_publicacion/likes", (req, res) => {
    likeController.obtenerLikes(req, res);
});

module.exports = router;
const express = require("express");
const calificacionController = require("../controllers/calificacionController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, calificacionController.crear);

router.get("/vendedor/:idUsuario", calificacionController.obtenerPorVendedor);

module.exports = router;
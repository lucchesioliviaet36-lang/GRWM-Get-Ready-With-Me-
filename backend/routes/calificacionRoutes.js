const express = require("express");
const calificacionController = require("../controllers/calificacionController");
const authMiddleware = require("../middlewares/authMiddleware");
const verificarPermiso = require("../middlewares/permisoMiddleware");

const router = express.Router();

router.post("/", authMiddleware, verificarPermiso("CALIFICAR_PRODUCTO"),
    calificacionController.crear
);

router.get("/vendedor/:idUsuario", calificacionController.obtenerPorVendedor);

module.exports = router;
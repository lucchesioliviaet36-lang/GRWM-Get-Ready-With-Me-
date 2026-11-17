const express = require("express");
const router = express.Router();

const bitacoraController = require("../controllers/bitacoraController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Obtener registros de bitácora (solo administrador)
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    bitacoraController.obtenerTodos
);

module.exports = router;
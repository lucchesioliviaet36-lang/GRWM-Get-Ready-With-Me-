const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/registrar", (req, res) => {
    authController.registrar(req, res);
});

router.post("/iniciarSesion", (req, res) => {
    authController.iniciar_sesion(req, res);
});

router.post("/cerrar_sesion", (req, res) => {
    authController.cerrar_sesion(req, res);
});

// Cambiar contraseña del usuario autenticado
router.put("/cambiar-contrasena", authMiddleware, (req, res) => {
    authController.cambiarContraseña(req, res);
});

router.post("/recuperar-contrasena", authController.solicitarRecuperacion);

router.post("/restablecer-contrasena/:token", authController.restablecerContrasena);

module.exports = router;
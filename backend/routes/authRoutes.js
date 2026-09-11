const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/registrar", (req, res) => {
    authController.registrar(req, res);
});

router.post("/iniciar_sesion", (req, res) => {
    authController.iniciar_sesion(req, res);
});

router.post("/cerrar_sesion", (req, res) => {
    authController.cerrar_sesion(req, res);
});

module.exports = router;
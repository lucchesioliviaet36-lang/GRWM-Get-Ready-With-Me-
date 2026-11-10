const express = require("express");
const pagoController = require("../controllers/pagoController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/saldo", authMiddleware, pagoController.obtenerSaldo);

router.post("/cargar-saldo", authMiddleware, pagoController.cargarSaldo);

router.post("/comprar-efectivo", authMiddleware, pagoController.comprarEnEfectivo);

router.post("/comprar", authMiddleware, pagoController.comprarProducto);

module.exports = router;
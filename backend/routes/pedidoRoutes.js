const express = require("express");
const pedidoController = require("../controllers/pedidoController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/historial", authMiddleware, pedidoController.obtenerHistorialCompras);

router.get("/:id", authMiddleware, pedidoController.obtenerPedido);

router.post("/:id/recibido", authMiddleware, pedidoController.confirmarRecepcion);

module.exports = router;

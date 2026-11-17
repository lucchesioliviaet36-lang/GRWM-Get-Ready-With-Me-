const express = require("express");
const pagoController = require("../controllers/pagoController");
const authMiddleware = require("../middlewares/authMiddleware");
const verificarPermiso = require("../middlewares/permisoMiddleware");

const router = express.Router();

router.get("/saldo", authMiddleware, pagoController.obtenerSaldo);

router.post("/cargar-saldo", authMiddleware, pagoController.cargarSaldo);

router.post("/comprar-efectivo", authMiddleware, verificarPermiso("COMPRAR_PRODUCTO"),
    pagoController.comprarEnEfectivo
);

router.post("/comprar", authMiddleware, verificarPermiso("COMPRAR_PRODUCTO"),
    pagoController.comprarProducto
);

module.exports = router;
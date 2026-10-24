const express = require("express");
const productoController = require("../controllers/productoController");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadProducto = require("../middlewares/uploadProducto");
const router = express.Router();

router.get("/general", productoController.obtenerProductosGenerales);

router.get("/", authMiddleware, productoController.obtenerProductos);

router.post("/", authMiddleware, uploadProducto.single("imagen"),productoController.agregar);

router.delete( "/:id", authMiddleware, productoController.eliminar );

module.exports = router;
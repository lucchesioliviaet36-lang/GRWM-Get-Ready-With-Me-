const express = require("express");
const prendaController = require("../controllers/prendaController");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadPrenda = require("../middlewares/uploadPrenda");

const router = express.Router();

router.get( "/", authMiddleware, prendaController.obtenerMiArmario);

router.post( "/", authMiddleware, uploadPrenda.single("imagen"), prendaController.agregar);

router.delete("/:id", authMiddleware, prendaController.eliminar);

module.exports = router;
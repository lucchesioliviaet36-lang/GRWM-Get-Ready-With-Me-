const express = require("express");
const prendaController = require("../controllers/prendaController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, prendaController.obtenerMiArmario);

router.post("/", authMiddleware, prendaController.agregar);

router.delete("/:id", authMiddleware, prendaController.eliminar);

module.exports = router;
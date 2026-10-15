const express = require("express");
const iaOutfitRoutes =  require("../controllers/iaOutfitController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/prendas", authMiddleware, iaOutfitRoutes.obtenerPrendasDisponibles);
router.post("/outfit", authMiddleware, iaOutfitRoutes.generarOutfit);

module.exports = router;
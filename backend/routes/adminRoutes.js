const express = require("express");
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/bitacora", adminController.obtenerBitacora);

router.get("/dvv", adminController.obtenerDVV);

router.get("/integridad", adminController.verificarIntegridad);

module.exports = router;
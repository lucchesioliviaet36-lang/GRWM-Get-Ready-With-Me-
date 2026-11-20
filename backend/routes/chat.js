const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware");
const verificarPermiso = require("../middlewares/permisoMiddleware");

router.use(authMiddleware);

router.get("/usuarios", chatController.obtenerUsuariosDisponibles);

router.get("/usuarios/:usuarioId", chatController.obtenerUsuario);

router.get("/", chatController.obtenerConversaciones);

router.get("/:usuario2Id", chatController.obtenerMensajes);

router.post("/", verificarPermiso("ENVIAR_MENSAJE"), chatController.enviarMensaje);

module.exports = router;
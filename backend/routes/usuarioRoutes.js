const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/buscar", authMiddleware, (req, res) => {
        usuarioController.buscarUsuarios(req, res);
    }
);

// 🟢 Obtener perfil de la cuenta activa
router.get("/perfil", authMiddleware, (req, res) => {
    usuarioController.obtenerPerfil(req, res);
});

// 🟢 Editar perfil en la base de datos
router.put("/perfil", authMiddleware, (req, res) => {
    usuarioController.actualizarPerfil(req, res);
});

router.delete( "/:id", authMiddleware, (req, res) => {
        usuarioController.eliminarCuenta(req,res);
    }
);

module.exports = router;
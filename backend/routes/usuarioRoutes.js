const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadPerfil = require("../middlewares/uploadPerfil");
const router = express.Router();

router.get("/buscar", authMiddleware, (req, res) => {
        usuarioController.buscarUsuarios(req, res);
    }
);

router.get("/:id", authMiddleware, usuarioController.obtenerPorId);

// 🟢 Obtener perfil de la cuenta activa
router.put( "/perfil", authMiddleware,
    uploadPerfil.fields([
        {
            name: "foto_perfil",
            maxCount: 1
        },
        {
            name: "banner",
            maxCount: 1
        }
    ]),
    usuarioController.actualizarPerfil
);

// 🟢 Editar perfil en la base de datos
router.put("/perfil", authMiddleware, (req, res) => {
    usuarioController.actualizarPerfil(req, res);
});

router.delete( "/:id", authMiddleware, (req, res) => {
        usuarioController.eliminarCuenta(req,res);
    }
);

module.exports = router;
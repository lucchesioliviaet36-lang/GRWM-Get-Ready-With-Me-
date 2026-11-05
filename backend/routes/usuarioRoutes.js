const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadPerfil = require("../middlewares/uploadPerfil");
const router = express.Router();

router.get("/buscar", authMiddleware, (req, res) => {
        usuarioController.buscarUsuarios(req, res);
    }
);


// Obtener perfil del usuario logueado
router.get("/perfil", authMiddleware, usuarioController.obtenerPerfil);



// Seguir a un usuario
router.post("/:id/seguir", authMiddleware, usuarioController.seguirUsuario);

// Dejar de seguir a un usuario
router.delete("/:id/seguir", authMiddleware, usuarioController.dejarDeSeguir);

// Obtener cantidad de seguidores y seguidos
router.get("/:id/estadisticas-seguimiento", authMiddleware, usuarioController.obtenerEstadisticasSeguimiento);

router.get("/:id/seguir", authMiddleware, usuarioController.obtenerEstadoSeguimiento);



router.get("/:id", authMiddleware, usuarioController.obtenerPorId);


// Editar perfil en la base de datos
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


router.delete( "/:id", authMiddleware, (req, res) => {
        usuarioController.eliminarCuenta(req,res);
    }
);

module.exports = router;
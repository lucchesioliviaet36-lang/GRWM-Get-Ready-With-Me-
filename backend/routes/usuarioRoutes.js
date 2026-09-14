const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/buscar", authMiddleware, (req, res) => {
        usuarioController.buscarUsuarios(req, res);
    }
);

router.delete( "/:id", authMiddleware, (req, res) => {
        usuarioController.eliminarCuenta(req,res);
    }
);

module.exports = router;
const express = require("express");
const usuarioController = require("../controllers/usuarioController");

const router = express.Router();


router.delete("/:id", (req, res) => {
    usuarioController.eliminarCuenta(req, res);
});

module.exports = router;
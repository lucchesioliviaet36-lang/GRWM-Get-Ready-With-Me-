const express = require("express");
const catalogoController = require ("../controllers/catalogoController");
const router = express.Router();

router.get( "/:categoria", catalogoController.obtenerPorCategoria);

module.exports = router;
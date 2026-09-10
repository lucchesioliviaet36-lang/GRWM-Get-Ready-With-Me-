const express = require("express");
const catalogoController = require ("../controllers/catalogoController");
const router = express.Router();

router.get(
  "/categoria/:categoria",
  catalogoController.obtenerPorCategoria
);

module.exports = router;
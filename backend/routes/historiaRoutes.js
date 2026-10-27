const express = require('express');
const router = express.Router();
const { obtenerHistorias } = require('../controllers/historiaController');

router.get('/', obtenerHistorias);

module.exports = router;
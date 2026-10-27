const express = require('express');
const router = express.Router();
const { obtenerHistorias } = require('../controllers/historiaController');

router.get('/', historiaController.obtenerHistorias);

router.post('/historia', historiaController.crearHistoria); 
router.post('/:id/like', historiaController.darLikeHistoria); 
router.post('/:id/comentar', historiaController.comentarHistoria); 
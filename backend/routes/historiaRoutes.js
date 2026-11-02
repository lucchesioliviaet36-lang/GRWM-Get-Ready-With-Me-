const express = require('express');
const router = express.Router();
const historiaController = require('../controllers/historiaController');


router.get('/', historiaController.obtenerHistorias);
router.post('/:id/like', historiaController.darLikeHistoria); 
router.post('/:id/comentar', historiaController.comentarHistoria); 
router.post('/historia', historiaController.crearHistoria);

module.exports = router; 
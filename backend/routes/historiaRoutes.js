const express = require('express');
const router = express.Router();
const historiaController = require('../controllers/historiaController');
const uploadHistoria = require('../middlewares/uploadHistoria');

router.get('/', historiaController.obtenerHistorias);
router.post('/:id/like', historiaController.darLikeHistoria);
router.post('/:id/comentar', historiaController.comentarHistoria);
router.post('/historia', uploadHistoria.single('imagen'), historiaController.crearHistoria);

module.exports = router;
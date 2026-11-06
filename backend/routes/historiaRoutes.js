const express = require('express');
const router = express.Router();
const historiaController = require('../controllers/historiaController');
const uploadHistoria = require('../middlewares/uploadHistoria');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', historiaController.obtenerHistorias);
router.delete('/:id', authMiddleware, historiaController.eliminarHistoria);
router.post('/:id/like', historiaController.darLikeHistoria);
router.post('/:id/comentar', historiaController.comentarHistoria);
router.post('/historia', authMiddleware, uploadHistoria.single('imagen'), historiaController.crearHistoria);

module.exports = router;
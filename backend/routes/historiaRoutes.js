const express = require('express');
const router = express.Router();

const historiaController = require('../controllers/historiaController');
const uploadHistoria = require('../middlewares/uploadHistoria');
const authMiddleware = require('../middlewares/authMiddleware');
const verificarPermiso = require('../middlewares/permisoMiddleware');

router.get('/', historiaController.obtenerHistorias);

router.get('/:id/comentarios', historiaController.obtenerComentariosHistoria);

router.delete('/:id', authMiddleware, historiaController.eliminarHistoria);

router.post('/:id/comentar', authMiddleware, historiaController.comentarHistoria);

router.post( '/historia', authMiddleware, verificarPermiso("CREAR_HISTORIA"),  uploadHistoria.single('imagen'),
    historiaController.crearHistoria
);

module.exports = router;
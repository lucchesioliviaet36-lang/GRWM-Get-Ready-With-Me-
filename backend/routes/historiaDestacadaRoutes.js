const express = require('express');
const controller = require('../controllers/historiaDestacadaController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/usuario/:idUsuario', controller.obtenerGrupos);
router.post('/', authMiddleware, controller.crearGrupo);
router.delete('/:idGrupo', authMiddleware, controller.eliminarGrupo);

module.exports = router;

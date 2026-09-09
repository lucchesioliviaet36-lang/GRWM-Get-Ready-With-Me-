const express = require('express');
const router = express.Router();
const Mensaje = require('../models/Mensaje');
const { Op } = require('sequelize');

// Obtener historial de mensajes optimizado con límite
router.get('/:usuario1Id/:usuario2Id', async (req, res) => {
  try {
    const { usuario1Id, usuario2Id } = req.params;
    const mensajes = await Mensaje.findAll({
      where: {
        [Op.or]: [
          { remitenteId: usuario1Id, destinatarioId: usuario2Id },
          { remitenteId: usuario2Id, destinatarioId: usuario1Id }
        ]
      },
      order: [['createdAt', 'ASC']],
      limit: 50 // Mejora de rendimiento para limitar historial largo
    });
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mensajes de MySQL' });
  }
});

// Guardar un mensaje nuevo con validación previa
router.post('/', async (req, res) => {
  try {
    const { remitenteId, destinatarioId, contenido } = req.body;
    
    if (!remitenteId || !destinatarioId || !contenido || !contenido.trim()) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para enviar el mensaje' });
    }

    const nuevoMensaje = await Mensaje.create({ 
      remitenteId, 
      destinatarioId, 
      contenido: contenido.trim() 
    });
    
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el mensaje en MySQL' });
  }
});

module.exports = router;
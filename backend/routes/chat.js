const express = require('express');
const router = express.Router();
const Mensaje = require('../models/Mensaje');
const { Op } = require('sequelize');
const Usuario = require('../models/usuarioModels');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

const idPositivo = (value) => Number.isInteger(Number(value)) && Number(value) > 0;
const camposPublicosUsuario = ['id_usuario', 'nombre', 'apellido', 'username', 'foto_perfil'];

// Usuarios reales disponibles para iniciar una conversación.
router.get('/usuarios', async (req, res) => {
  try {
    const usuarioId = Number(req.user.id_usuario);
    const termino = String(req.query.q || '').trim();
    const filtros = [{ id_usuario: { [Op.ne]: usuarioId } }];
    if (termino) {
      filtros.push({
        [Op.or]: [
          { username: { [Op.like]: `%${termino}%` } },
          { nombre: { [Op.like]: `%${termino}%` } },
          { apellido: { [Op.like]: `%${termino}%` } }
        ]
      });
    }
    const usuarios = await Usuario.findAll({
      where: { [Op.and]: filtros },
      attributes: camposPublicosUsuario,
      order: [['username', 'ASC']],
      limit: 50
    });
    res.json({ usuarios });
  } catch (error) {
    console.error('Error al listar usuarios para chat:', error);
    res.status(500).json({ error: 'Error al listar usuarios disponibles' });
  }
});

// Ficha pública limitada a lo necesario para el encabezado del chat.
router.get('/usuarios/:usuarioId', async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuarioId);
    if (!idPositivo(usuarioId) || usuarioId === Number(req.user.id_usuario)) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const usuario = await Usuario.findByPk(usuarioId, { attributes: camposPublicosUsuario });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ usuario });
  } catch (error) {
    console.error('Error al cargar usuario para chat:', error);
    res.status(500).json({ error: 'Error al cargar el usuario' });
  }
});

// Contactos con los que el usuario autenticado ya tiene historial.
router.get('/', async (req, res) => {
  try {
    const usuarioId = req.user.id_usuario;
    const mensajes = await Mensaje.findAll({
      where: { [Op.or]: [{ remitenteId: usuarioId }, { destinatarioId: usuarioId }] },
      order: [['createdAt', 'DESC']]
    });
    const ultimosPorContacto = new Map();
    for (const mensaje of mensajes) {
      const contactoId = Number(mensaje.remitenteId) === Number(usuarioId)
        ? Number(mensaje.destinatarioId) : Number(mensaje.remitenteId);
      if (!ultimosPorContacto.has(contactoId)) ultimosPorContacto.set(contactoId, mensaje);
    }
    const usuarios = await Usuario.findAll({
      where: { id_usuario: { [Op.in]: [...ultimosPorContacto.keys()] } },
      attributes: ['id_usuario', 'nombre', 'apellido', 'username', 'foto_perfil']
    });
    res.json(usuarios.map(usuario => {
      const ultimo = ultimosPorContacto.get(Number(usuario.id_usuario));
      return { ...usuario.toJSON(), ultimoMensaje: ultimo.contenido, fechaMensaje: ultimo.createdAt };
    }).sort((a, b) => new Date(b.fechaMensaje) - new Date(a.fechaMensaje)));
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    res.status(500).json({ error: 'Error al obtener conversaciones' });
  }
});

// Obtener historial de mensajes optimizado con límite
router.get('/:usuario2Id', async (req, res) => {
  try {
    const usuario1Id = Number(req.user.id_usuario);
    const usuario2Id = Number(req.params.usuario2Id);
    if (!idPositivo(usuario2Id) || usuario1Id === usuario2Id) {
      return res.status(400).json({ error: 'Destinatario inválido' });
    }
    const destinatario = await Usuario.findByPk(usuario2Id, { attributes: ['id_usuario'] });
    if (!destinatario) return res.status(404).json({ error: 'Usuario no encontrado' });
    const mensajes = await Mensaje.findAll({
      where: {
        [Op.or]: [
          { remitenteId: usuario1Id, destinatarioId: usuario2Id },
          { remitenteId: usuario2Id, destinatarioId: usuario1Id }
        ]
      },
      order: [['createdAt', 'DESC'], ['id', 'DESC']],
      limit: 100
    });
    res.json(mensajes.reverse());
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes de MySQL' });
  }
});

// Guardar un mensaje nuevo con validación previa
router.post('/', async (req, res) => {
  try {
    const { destinatarioId, contenido } = req.body;
    const remitenteId = Number(req.user.id_usuario);
    const receptorId = Number(destinatarioId);
    
    if (!idPositivo(receptorId) || remitenteId === receptorId || typeof contenido !== 'string' || !contenido.trim()) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para enviar el mensaje' });
    }
    const destinatario = await Usuario.findByPk(receptorId, { attributes: ['id_usuario'] });
    if (!destinatario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const nuevoMensaje = await Mensaje.create({ 
      remitenteId,
      destinatarioId: receptorId,
      contenido: contenido.trim() 
    });
    
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error('Error al guardar mensaje:', error);
    res.status(500).json({ error: 'Error al guardar el mensaje en MySQL' });
  }
});

module.exports = router;

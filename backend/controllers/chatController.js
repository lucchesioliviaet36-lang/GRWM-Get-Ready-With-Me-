const chatService = require("../services/chatService");

const obtenerUsuariosDisponibles = async (req, res) => {
    try {
        const usuarios = await chatService.obtenerUsuariosDisponibles(
            req.user.id_usuario,
            req.query.q
        );

        return res.json({ usuarios });

    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.message
        });
    }
};

const obtenerUsuario = async (req, res) => {
    try {
        const usuario = await chatService.obtenerUsuario(
            req.user.id_usuario,
            req.params.usuarioId
        );

        return res.json({ usuario });

    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.message
        });
    }
};

const obtenerConversaciones = async (req, res) => {
    try {
        const conversaciones = await chatService.obtenerConversaciones(
            req.user.id_usuario
        );

        return res.json(conversaciones);

    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.message
        });
    }
};

const obtenerMensajes = async (req, res) => {
    try {
        const mensajes = await chatService.obtenerMensajes(
            req.user.id_usuario,
            req.params.usuario2Id
        );

        return res.json(mensajes);

    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.message
        });
    }
};

const enviarMensaje = async (req, res) => {
    try {
        const { destinatarioId, contenido } = req.body;
        const remitenteId = req.user.id_usuario;

        const mensaje = await chatService.enviarMensaje(
            remitenteId,
            destinatarioId,
            contenido
        );

        return res.status(201).json(mensaje);

    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.message
        });
    }
};

module.exports = {
    obtenerUsuariosDisponibles,
    obtenerUsuario,
    obtenerConversaciones,
    obtenerMensajes,
    enviarMensaje
};
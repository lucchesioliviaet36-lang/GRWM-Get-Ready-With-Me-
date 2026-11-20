const chatDAO = require("../dao/chatDAO");

const crearError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    return error;
};

// Obtener usuarios disponibles para iniciar un chat
const obtenerUsuariosDisponibles = async (usuarioId, termino) => {
    return await chatDAO.obtenerUsuariosDisponibles(
        usuarioId,
        String(termino || "").trim()
    );
};

// Obtener un usuario específico
const obtenerUsuario = async (usuarioActualId, usuarioId) => {
    const id = Number(usuarioId);

    if (!Number.isInteger(id) || id <= 0 || id === Number(usuarioActualId)) {
        throw crearError("Usuario no encontrado", 404);
    }

    const usuario = await chatDAO.obtenerUsuarioPorId(id);

    if (!usuario) {
        throw crearError("Usuario no encontrado", 404);
    }

    return usuario;
};

// Obtener las conversaciones del usuario
const obtenerConversaciones = async (usuarioId) => {
    const mensajes = await chatDAO.obtenerMensajesDeUsuario(usuarioId);

    const ultimosPorContacto = new Map();

    mensajes.forEach(mensaje => {
        const contactoId =
            Number(mensaje.remitenteId) === Number(usuarioId)
                ? Number(mensaje.destinatarioId)
                : Number(mensaje.remitenteId);

        if (!ultimosPorContacto.has(contactoId)) {
            ultimosPorContacto.set(contactoId, mensaje);
        }
    });

    const idsContactos = [...ultimosPorContacto.keys()];

    if (!idsContactos.length) {
        return [];
    }

    const usuarios = await chatDAO.obtenerUsuariosPorIds(idsContactos);

    return usuarios.map(usuario => {
        const ultimoMensaje = ultimosPorContacto.get(
            Number(usuario.id_usuario)
        );

        return {
            ...usuario.toJSON(),
            ultimoMensaje: ultimoMensaje.contenido,
            fechaMensaje: ultimoMensaje.createdAt,
            ultimoRemitenteId: ultimoMensaje.remitenteId
        };
    }).sort((a, b) =>
        new Date(b.fechaMensaje) - new Date(a.fechaMensaje)
    );
};

// Obtener mensajes entre dos usuarios
const obtenerMensajes = async (usuarioActualId, usuario2Id) => {
    const id = Number(usuario2Id);

    if (!Number.isInteger(id) || id <= 0 || id === Number(usuarioActualId)) {
        throw crearError("Usuario no encontrado", 404);
    }

    const usuario = await chatDAO.obtenerUsuarioPorId(id);

    if (!usuario) {
        throw crearError("Usuario no encontrado", 404);
    }

    const mensajes = await chatDAO.obtenerHistorial(usuarioActualId, id);

    // Se invierte para mostrarlos del más antiguo al más reciente
    return mensajes.reverse();
};

// Enviar un mensaje
const enviarMensaje = async (
    remitenteId,
    destinatarioId,
    contenido
) => {
    const receptorId = Number(destinatarioId);

    if (
        !Number.isInteger(receptorId) ||
        receptorId <= 0 ||
        Number(remitenteId) === receptorId ||
        typeof contenido !== "string" ||
        !contenido.trim()
    ) {
        throw crearError("Datos inválidos para enviar el mensaje", 400);
    }

    const destinatario = await chatDAO.obtenerUsuarioPorId(receptorId);

    if (!destinatario) {
        throw crearError("Usuario no encontrado", 404);
    }

    return await chatDAO.crearMensaje(
        remitenteId,
        receptorId,
        contenido.trim()
    );
};

module.exports = {
    obtenerUsuariosDisponibles,
    obtenerUsuario,
    obtenerConversaciones,
    obtenerMensajes,
    enviarMensaje
};
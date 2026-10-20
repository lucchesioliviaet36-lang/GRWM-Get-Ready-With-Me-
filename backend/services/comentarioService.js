const comentarioDAO = require("../dao/comentarioDAO.js");

const obtenerComentarios = async (id_publicacion) => {
    return await comentarioDAO.obtenerComentariosPorPublicacion(
        id_publicacion
    );
};

const crearComentario = async (
    id_publicacion,
    id_usuario,
    comentario
) => {
    return await comentarioDAO.crearComentario(
        id_publicacion,
        id_usuario,
        comentario
    );
};

const eliminarComentario = async (id_comentario, id_usuario) => {
    return await comentarioDAO.eliminarComentario(
        id_comentario,
        id_usuario
    );
};

module.exports = {
    obtenerComentarios,
    crearComentario,
    eliminarComentario
};
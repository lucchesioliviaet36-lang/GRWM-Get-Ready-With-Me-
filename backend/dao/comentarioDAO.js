const PublicacionComentario = require("../models/comentarioModel.js");
const Usuario = require("../models/usuarioModels.js");

// Obtener los comentarios de una publicación
const obtenerComentariosPorPublicacion = async (id_publicacion) => {
    const comentarios = await PublicacionComentario.findAll({
        where: { id_publicacion },
        order: [["fecha_comentario", "ASC"]]
    });

    const comentariosConUsuario = await Promise.all(
        comentarios.map(async (comentario) => {
            const usuario = await Usuario.findByPk(
                comentario.id_usuario,
                {
                    attributes: ["id_usuario", "username", "nombre"]
                }
            );

            return {
                id_comentario: comentario.id_comentario,
                comentario: comentario.comentario,
                fecha_comentario: comentario.fecha_comentario,
                id_usuario: comentario.id_usuario,
                username: usuario?.username,
                nombre: usuario?.nombre
            };
        })
    );

    return comentariosConUsuario;
};

// Crear un comentario
const crearComentario = async (
    id_publicacion,
    id_usuario,
    comentario
) => {
    return await PublicacionComentario.create({
        id_publicacion,
        id_usuario,
        comentario
    });
};

// Eliminar un comentario verificando quién lo escribió
const eliminarComentario = async (id_comentario, id_usuario) => {
    return await PublicacionComentario.destroy({
        where: {
            id_comentario,
            id_usuario
        }
    });
};

module.exports = {
    obtenerComentariosPorPublicacion,
    crearComentario,
    eliminarComentario
};
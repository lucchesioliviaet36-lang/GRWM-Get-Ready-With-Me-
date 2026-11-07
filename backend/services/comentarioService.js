const comentarioDAO = require("../dao/comentarioDAO.js");
const digitoVerificadorService = require("./digitoVerificadorService");
const bitacoraService = require("./bitacoraService");

const obtenerComentarios = async (id_publicacion) => {
    return await comentarioDAO.obtenerComentariosPorPublicacion(id_publicacion);
};

const crearComentario = async (
    id_publicacion,
    id_usuario,
    comentario
) => {
    const nuevoComentario =
        await comentarioDAO.crearComentario(
            id_publicacion,
            id_usuario,
            comentario
        );

    const Comentario = nuevoComentario.constructor;

    await digitoVerificadorService.recalcularRegistroYTabla(
        Comentario,
        "Comentario",
        "id_comentario",
        nuevoComentario.id_comentario
    );

    await bitacoraService.registrar({
        idUsuario: id_usuario,
        descripcion: "Comentario creado",
        accion: "INSERT",
        tablaAfectada: "Comentario",
        usuarioAfectado: id_usuario
    });

    return nuevoComentario;
};

const eliminarComentario = async (id_comentario, id_usuario) => {
    const comentario = await comentarioDAO.buscarPorId(id_comentario);

    if (!comentario) {
        throw new Error(
            "Comentario no encontrado"
        );
    }

    const Comentario = comentario.constructor;

    const resultado = await comentarioDAO.eliminarComentario(id_comentario, id_usuario);

    await digitoVerificadorService.recalcularTabla(
        Comentario,
        "Comentario",
        "id_comentario"
    );

    await bitacoraService.registrar({
        idUsuario: id_usuario,
        descripcion: "Comentario eliminado",
        accion: "DELETE",
        tablaAfectada: "Comentario",
        usuarioAfectado: id_usuario
    });

    return resultado;
};

module.exports = {
    obtenerComentarios,
    crearComentario,
    eliminarComentario
};
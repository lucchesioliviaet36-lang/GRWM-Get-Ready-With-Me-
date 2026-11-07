const likeDao = require("../dao/likeDAO.js");
const digitoVerificadorService = require("./digitoVerificadorService");
const bitacoraService = require("./bitacoraService");

const alternarLike = async ( id_usuario, id_publicacion) => {
    const meGustaExistente = await likeDao.buscarLike(id_usuario, id_publicacion);

    if (meGustaExistente) {
        const Like = meGustaExistente.constructor;

        await likeDao.quitarLike(id_usuario, id_publicacion);

        await digitoVerificadorService.recalcularTabla(
            Like,
            "Like",
            "id_like"
        );

        await bitacoraService.registrar({
            idUsuario: id_usuario,
            descripcion: "Like eliminado",
            accion: "DELETE",
            tablaAfectada: "Like",
            usuarioAfectado: id_usuario
        });

        const totalLikes = await likeDao.contarLikes(id_publicacion);

        return {
            dioLike: false,
            totalLikes
        };
    }

    await likeDao.darLike(id_usuario, id_publicacion);

    const nuevoLike = await likeDao.buscarLike(id_usuario, id_publicacion);

    if (nuevoLike) {
        const Like = nuevoLike.constructor;

        await digitoVerificadorService.recalcularRegistroYTabla(
            Like,
            "Like",
            "id_like",
            nuevoLike.id_like
        );
    }

    await bitacoraService.registrar({
        idUsuario: id_usuario,
        descripcion: "Like agregado",
        accion: "INSERT",
        tablaAfectada: "Like",
        usuarioAfectado: id_usuario
    });

    const totalLikes = await likeDao.contarLikes(id_publicacion);

    return {
        dioLike: true,
        totalLikes
    };
};

const obtenerLikesPublicacion = async (id_publicacion, id_usuario = null) => {
    const totalLikes = await likeDao.contarLikes(id_publicacion);

    let dioLike = false;

    if (id_usuario) {
        const existe = await likeDao.buscarLike(id_usuario, id_publicacion);
        dioLike = !!existe;
    }

    return {
        totalLikes,
        dioLike
    };
};

module.exports = {
    alternarLike,
    obtenerLikesPublicacion
};
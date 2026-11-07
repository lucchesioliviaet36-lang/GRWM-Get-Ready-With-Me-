const favoritoDao = require("../dao/favoritoDAO.js");
const digitoVerificadorService = require("./digitoVerificadorService");
const bitacoraService = require("./bitacoraService");

const toggleFavorito = async (id_usuario, id_publicacion) => {
    const existe = await favoritoDao.obtenerFavorito(id_usuario, id_publicacion);

    if (existe) {
        const Favorito = existe.constructor;

        await favoritoDao.eliminarFavorito(id_usuario, id_publicacion);

        await digitoVerificadorService.recalcularTabla(
            Favorito,
            "Favorito",
            "id_favorito"
        );

        await bitacoraService.registrar({
            idUsuario: id_usuario,
            descripcion: "Favorito eliminado",
            accion: "DELETE",
            tablaAfectada: "Favorito",
            usuarioAfectado: id_usuario
        });

        return {
            esFavorito: false
        };
    }

    await favoritoDao.agregarFavorito(id_usuario, id_publicacion);

    const nuevoFavorito = await favoritoDao.obtenerFavorito(id_usuario, id_publicacion);

    if (nuevoFavorito) {
        const Favorito = nuevoFavorito.constructor;

        await digitoVerificadorService.recalcularRegistroYTabla(
            Favorito,
            "Favorito",
            "id_favorito",
            nuevoFavorito.id_favorito
        );
    }

    await bitacoraService.registrar({
        idUsuario: id_usuario,
        descripcion: "Favorito agregado",
        accion: "INSERT",
        tablaAfectada: "Favorito",
        usuarioAfectado: id_usuario
    });

    return {
        esFavorito: true
    };
};

const obtenerEstadoFavorito = async (id_usuario, id_publicacion) => {
    const existe = await favoritoDao.obtenerFavorito(id_usuario, id_publicacion);

    return {
        esFavorito: !!existe
    };
};

const obtenerFavoritosPorUsuario = async (id_usuario) => {
    return await favoritoDao.obtenerFavoritosPorUsuario(
        id_usuario
    );
};

module.exports = {
    toggleFavorito,
    obtenerEstadoFavorito,
    obtenerFavoritosPorUsuario
};
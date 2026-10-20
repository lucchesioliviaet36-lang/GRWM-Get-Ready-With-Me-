const favoritoDao = require("../dao/favoritoDAO.js");

const toggleFavorito = async (id_usuario, id_publicacion) => {
    const existe = await favoritoDao.obtenerFavorito(
        id_usuario,
        id_publicacion
    );

    if (existe) {
        await favoritoDao.eliminarFavorito(
            id_usuario,
            id_publicacion
        );

        return { esFavorito: false };
    } else {
        await favoritoDao.agregarFavorito(
            id_usuario,
            id_publicacion
        );

        return { esFavorito: true };
    }
};

const obtenerEstadoFavorito = async (id_usuario, id_publicacion) => {
    const existe = await favoritoDao.obtenerFavorito(
        id_usuario,
        id_publicacion
    );

    return { esFavorito: !!existe };
};

const obtenerFavoritosPorUsuario = async (id_usuario) => {
    return await favoritoDao.obtenerFavoritosPorUsuario(id_usuario);
};

module.exports = {
    toggleFavorito,
    obtenerEstadoFavorito,
    obtenerFavoritosPorUsuario
};
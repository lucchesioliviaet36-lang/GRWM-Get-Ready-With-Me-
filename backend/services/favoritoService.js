const favoritoDao = require("../dao/favoritoDAO.js");

class FavoritoService {
    async toggleFavorito(id_usuario, id_publicacion) {
        const existe = await favoritoDao.obtenerFavorito(id_usuario, id_publicacion);

        if (existe) {
            await favoritoDao.eliminarFavorito(id_usuario, id_publicacion);
            return { esFavorito: false };
        } else {
            await favoritoDao.agregarFavorito(id_usuario, id_publicacion);
            return { esFavorito: true };
        }
    }

    async obtenerEstadoFavorito(id_usuario, id_publicacion) {
        const existe = await favoritoDao.obtenerFavorito(id_usuario, id_publicacion);
        return { esFavorito: !!existe };
    }

    async obtenerFavoritosPorUsuario(id_usuario) {
        return await favoritoDao.obtenerFavoritosPorUsuario(id_usuario);
    }
}

module.exports = new FavoritoService();
const PublicacionFavorito = require("../models/favoritoModel.js");

class FavoritoDao {
    async obtenerFavorito(id_usuario, id_publicacion) {
        return await PublicacionFavorito.findOne({
            where: { id_usuario, id_publicacion }
        });
    }

    async agregarFavorito(id_usuario, id_publicacion) {
        return await PublicacionFavorito.create({ id_usuario, id_publicacion });
    }

    async eliminarFavorito(id_usuario, id_publicacion) {
        return await PublicacionFavorito.destroy({
            where: { id_usuario, id_publicacion }
        });
    }

    async obtenerFavoritosPorUsuario(id_usuario) {
        return await PublicacionFavorito.findAll({
            where: { id_usuario }
        });
    }
}

module.exports = new FavoritoDao();
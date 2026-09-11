const PublicacionLike = require("../models/publicacionLike.js");

class LikeDao {
    // Buscar si ya existe un like de ese usuario en esa publicación
    async buscarLike(id_usuario, id_publicacion) {
        return await PublicacionLike.findOne({
            where: {
                id_usuario: id_usuario,
                id_publicacion: id_publicacion
            }
        });
    }

    // Agregar like
    async darLike(id_usuario, id_publicacion) {
        return await PublicacionLike.create({
            id_usuario: id_usuario,
            id_publicacion: id_publicacion
        });
    }

    // Quitar el like
    async quitarLike(id_usuario, id_publicacion) {
        return await PublicacionLike.destroy({
            where: {
                id_usuario: id_usuario,
                id_publicacion: id_publicacion
            }
        });
    }

    // Contar el total de likes de una publicación
    async contarLikes(id_publicacion) {
        return await PublicacionLike.count({
            where: { id_publicacion: id_publicacion }
        });
    }
}

module.exports = new LikeDao();
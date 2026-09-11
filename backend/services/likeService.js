const likeDao = require("../dao/likeDAO.js");

class LikeService {
    async alternarLike(id_usuario, id_publicacion) {
        // Verificar si ya le dio me gusta
        const meGustaExistente = await likeDao.buscarLike(id_usuario, id_publicacion);

        if (meGustaExistente) {
            // Si ya existe, lo quitamos
            await likeDao.quitarLike(id_usuario, id_publicacion);
            const totalLikes = await likeDao.contarLikes(id_publicacion);
            return { dioLike: false, totalLikes };
        } else {
            // Si no existe, lo agregamos
            await likeDao.darLike(id_usuario, id_publicacion);
            const totalLikes = await likeDao.contarLikes(id_publicacion);
            return { dioLike: true, totalLikes };
        }
    }

    async obtenerLikesPublicacion(id_publicacion, id_usuario = null) {
        const totalLikes = await likeDao.contarLikes(id_publicacion);
        let dioLike = false;

        if (id_usuario) {
            const existe = await likeDao.buscarLike(id_usuario, id_publicacion);
            dioLike = !!existe;
        }

        return { totalLikes, dioLike };
    }
}

module.exports = new LikeService();
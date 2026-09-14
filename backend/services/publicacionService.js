const publicacionDao = require("../dao/publicacionDAO.js");

class PublicacionService {
    async crearPublicacion(descripcion, id_usuario, id_producto) {
        if (!id_usuario) {
            throw new Error("El id_usuario es obligatorio");
        }
        return await publicacionDao.crearPublicacion(descripcion, id_usuario, id_producto);
    }

    async obtenerPublicaciones() {
        return await publicacionDao.obtenerTodas();
    }

    async eliminarPublicacion(id_publicacion) {
    return await publicacionDao.eliminarPublicacion(id_publicacion);
    }
}

module.exports = new PublicacionService();
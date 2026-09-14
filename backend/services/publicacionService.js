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
}

module.exports = new PublicacionService();
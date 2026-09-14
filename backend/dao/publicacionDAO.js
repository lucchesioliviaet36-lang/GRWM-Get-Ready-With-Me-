const Publicacion = require("../models/publicacion.js");

class PublicacionDao {
    // Inserta la publicación en la tabla Publicacion de MySQL
    async crearPublicacion(descripcion, id_usuario, id_producto = null) {
        return await Publicacion.create({
            descripcion: descripcion,
            fecha_publicacion: new Date(),
            id_usuario: id_usuario,
            id_producto: id_producto
        });
    }

    // Obtiene todas las publicaciones de la base de datos
    async obtenerTodas() {
        return await Publicacion.findAll();
    }

    async eliminarPublicacion(id_publicacion) {
    return await Publicacion.destroy({
        where: { id_publicacion: id_publicacion }
    });
}
}

module.exports = new PublicacionDao();
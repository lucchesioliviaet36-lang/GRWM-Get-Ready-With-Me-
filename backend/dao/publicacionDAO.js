const Publicacion = require("../models/publicacion.js");

// Insertar una publicación
const crearPublicacion = async (
    descripcion,
    id_usuario,
    id_producto = null,
    imagen_url = null
) => {
    return await Publicacion.create({
        descripcion,
        fecha_publicacion: new Date(),
        id_usuario,
        id_producto,
        imagen_url
    });
};

// Obtener todas las publicaciones
const obtenerTodas = async () => {
    return await Publicacion.findAll();
};

// Eliminar una publicación
const eliminarPublicacion = async (id_publicacion) => {
    return await Publicacion.destroy({
        where: { id_publicacion: id_publicacion }
    });
};

module.exports = {
    crearPublicacion,
    obtenerTodas,
    eliminarPublicacion
};
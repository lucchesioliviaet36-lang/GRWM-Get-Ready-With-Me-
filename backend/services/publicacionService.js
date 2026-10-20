const publicacionDao = require("../dao/publicacionDAO.js");

const crearPublicacion = async (
    descripcion,
    id_usuario,
    id_producto,
    imagen_url
) => {
    if (!id_usuario) {
        throw new Error("El id_usuario es obligatorio");
    }

    return await publicacionDao.crearPublicacion(
        descripcion,
        id_usuario,
        id_producto,
        imagen_url
    );
};

const obtenerPublicaciones = async () => {
    return await publicacionDao.obtenerTodas();
};

const eliminarPublicacion = async (id_publicacion) => {
    return await publicacionDao.eliminarPublicacion(id_publicacion);
};

module.exports = {
    crearPublicacion,
    obtenerPublicaciones,
    eliminarPublicacion
};
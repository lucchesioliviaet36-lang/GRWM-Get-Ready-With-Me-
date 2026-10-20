const PublicacionLike = require("../models/publicacionLike.js");

// Buscar si ya existe un like
const buscarLike = async (id_usuario, id_publicacion) => {
    return await PublicacionLike.findOne({
        where: {
            id_usuario: id_usuario,
            id_publicacion: id_publicacion
        }
    });
};

// Agregar un like
const darLike = async (id_usuario, id_publicacion) => {
    return await PublicacionLike.create({
        id_usuario: id_usuario,
        id_publicacion: id_publicacion
    });
};

// Quitar un like
const quitarLike = async (id_usuario, id_publicacion) => {
    return await PublicacionLike.destroy({
        where: {
            id_usuario: id_usuario,
            id_publicacion: id_publicacion
        }
    });
};

// Contar los likes de una publicación
const contarLikes = async (id_publicacion) => {
    return await PublicacionLike.count({
        where: { id_publicacion: id_publicacion }
    });
};

module.exports = {
    buscarLike,
    darLike,
    quitarLike,
    contarLikes
};
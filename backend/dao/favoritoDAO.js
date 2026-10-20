const PublicacionFavorito = require("../models/favoritoModel.js");

// Buscar un favorito
const obtenerFavorito = async (id_usuario, id_publicacion) => {
    return await PublicacionFavorito.findOne({
        where: { id_usuario, id_publicacion }
    });
};

// Agregar un favorito
const agregarFavorito = async (id_usuario, id_publicacion) => {
    return await PublicacionFavorito.create({
        id_usuario,
        id_publicacion
    });
};

// Eliminar un favorito
const eliminarFavorito = async (id_usuario, id_publicacion) => {
    return await PublicacionFavorito.destroy({
        where: { id_usuario, id_publicacion }
    });
};

// Obtener los favoritos de un usuario
const obtenerFavoritosPorUsuario = async (id_usuario) => {
    return await PublicacionFavorito.findAll({
        where: { id_usuario }
    });
};

module.exports = {
    obtenerFavorito,
    agregarFavorito,
    eliminarFavorito,
    obtenerFavoritosPorUsuario
};
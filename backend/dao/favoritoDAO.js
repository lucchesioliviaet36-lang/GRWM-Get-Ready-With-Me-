const PublicacionFavorito = require("../models/favoritoModel.js");
const Publicacion = require("../models/publicacion.js");

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
    const favoritos = await PublicacionFavorito.findAll({
        where: { id_usuario }
    });

    const resultado = [];

    for (const favorito of favoritos) {
        const publicacion = await Publicacion.findByPk(
            favorito.id_publicacion
        );

        if (publicacion) {
            resultado.push({
                ...favorito.toJSON(),
                imagen_url: publicacion.imagen_url,
                descripcion: publicacion.descripcion
            });
        }
    }

    return resultado;
};

module.exports = {
    obtenerFavorito,
    agregarFavorito,
    eliminarFavorito,
    obtenerFavoritosPorUsuario
};
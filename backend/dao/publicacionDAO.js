const Publicacion = require("../models/publicacion.js");
const PublicacionEtiquetado = require("../models/publicacionEtiquetado.js");
const Usuario = require("../models/usuarioModels.js");

// Insertar una publicación
const crearPublicacion = async (
    descripcion,
    id_usuario,
    id_producto = null,
    imagen_url = null,
    musica_url = null,
    musica_titulo = null,
    musica_artista = null,
    musica_imagen = null,
    usuariosEtiquetados = []
) => {
    const nuevaPublicacion = await Publicacion.create({
        descripcion,
        fecha_publicacion: new Date(),
        id_usuario,
        id_producto,
        imagen_url,
        musica_url,
        musica_titulo,
        musica_artista,
        musica_imagen
    });

    if (usuariosEtiquetados.length > 0) {
        const etiquetas = usuariosEtiquetados.map((idUsuario) => ({
            id_usuario: Number(idUsuario),
            id_publicacion: nuevaPublicacion.id_publicacion
        }));

        await PublicacionEtiquetado.bulkCreate(etiquetas, {
            ignoreDuplicates: true
        });
    }

    return nuevaPublicacion;
};

// Obtener todas las publicaciones
const obtenerTodas = async () => {
    return await Publicacion.findAll({
        order: [
            ["fecha_publicacion", "DESC"],
            ["id_publicacion", "DESC"]
        ]
    });
};

// Obtener usuarios etiquetados en una publicación
const obtenerUsuariosEtiquetados = async (id_publicacion) => {
    const etiquetas = await PublicacionEtiquetado.findAll({
        where: { id_publicacion },
        attributes: ["id_usuario"]
    });

    const idsUsuarios = etiquetas.map(etiqueta => etiqueta.id_usuario);

    if (idsUsuarios.length === 0) {
        return [];
    }

    return await Usuario.findAll({
        where: {
            id_usuario: idsUsuarios
        },
        attributes: ["id_usuario", "username"]
    });
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
    eliminarPublicacion,
    obtenerUsuariosEtiquetados
};
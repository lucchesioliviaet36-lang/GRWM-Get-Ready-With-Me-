const publicacionDao = require("../dao/publicacionDAO.js");
const digitoVerificadorService = require("./digitoVerificadorService");
const bitacoraService = require("./bitacoraService");

const crearPublicacion = async (
    descripcion,
    id_usuario,
    id_producto,
    imagen_url,
    musica_url,
    musica_titulo,
    musica_artista,
    musica_imagen,
    usuariosEtiquetados = []
) => {
    if (!id_usuario) {
        throw new Error(
            "El id_usuario es obligatorio"
        );
    }

    const publicacion =
        await publicacionDao.crearPublicacion(
            descripcion,
            id_usuario,
            id_producto,
            imagen_url,
            musica_url,
            musica_titulo,
            musica_artista,
            musica_imagen,
            usuariosEtiquetados
        );

    const Publicacion = publicacion.constructor;

    await digitoVerificadorService.recalcularRegistroYTabla(
        Publicacion,
        "Publicacion",
        "id_publicacion",
        publicacion.id_publicacion
    );

    await bitacoraService.registrar({
        idUsuario: id_usuario,
        descripcion: "Publicación creada",
        accion: "INSERT",
        tablaAfectada: "Publicacion",
        usuarioAfectado: id_usuario
    });

    return publicacion;
};

const obtenerPublicaciones = async () => {
    return await publicacionDao.obtenerTodas();
};

const obtenerUsuariosEtiquetados = async (id_publicacion) => {
    return await publicacionDao.obtenerUsuariosEtiquetados(
        id_publicacion
    );
};

const eliminarPublicacion = async (id_publicacion) => {
    const publicaciones = await publicacionDao.obtenerTodas();

    const publicacion = publicaciones.find((item) =>
        Number(item.id_publicacion) === Number(id_publicacion));

    if (!publicacion) {
        throw new Error("Publicación no encontrada");
    }

    const idUsuario = publicacion.id_usuario;
    const Publicacion = publicacion.constructor;

    const resultado = await publicacionDao.eliminarPublicacion(id_publicacion);

    await digitoVerificadorService.recalcularTabla(
        Publicacion,
        "Publicacion",
        "id_publicacion"
    );

    await bitacoraService.registrar({
        idUsuario: idUsuario,
        descripcion: "Publicación eliminada",
        accion: "DELETE",
        tablaAfectada: "Publicacion",
        usuarioAfectado: idUsuario
    });

    return resultado;
};

module.exports = {
    crearPublicacion,
    obtenerPublicaciones,
    eliminarPublicacion,
    obtenerUsuariosEtiquetados
};
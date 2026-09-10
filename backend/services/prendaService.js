const prendaDAO = require("../dao/prendaDAO");

const agregarPrenda = async (idUsuario, datos) => {

    if (!datos.nombre) {
        throw new Error("El nombre de la prenda es obligatorio");
    }

    if(!datos.categoria) {
        throw new Error("La categoria es obligatoria");
    }

    return await prendaDAO.crear({
        id_usuario: idUsuario,
        nombre: datos.nombre,
        categoria: datos.categoria,
        color: datos.color || null,
        descripcion: datos.descripcion || null,
        imagen_url: datos.imagen_url || null,
        origen: datos.origen || "manual",
        id_externo: datos.id_externo || null
    });
};

const obtenerArmario = async (idUsuario) => {
    return await prendaDAO.obtenerPorUsuario(idUsuario);
};

const eliminarPrenda = async (idPrenda, idUsuario) => {
    const eliminadas = await prendaDAO.eliminar(idPrenda, idUsuario);

    if (eliminadas === 0) {
        throw new Error("Prenda no encontrada");
    }

    return true;
};

module.exports = {agregarPrenda, obtenerArmario, eliminarPrenda}
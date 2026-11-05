const prendaDAO = require("../dao/prendaDAO");
const Prenda = require("../models/prenda");
const digitoVerificadorService = require("./digitoVerificadorService");
const bitacoraService = require("./bitacoraService");

const agregarPrenda = async (idUsuario, datos) => {

    const prenda = await prendaDAO.crear(datos);

    if (!datos.nombre) {
        throw new Error("El nombre de la prenda es obligatorio");
    }

    if (!datos.categoria) {
        throw new Error("La categoría es obligatoria");
    }
    
    await digitoVerificadorService.recalcularRegistroYTabla(
        Prenda,
        "Prenda",
        "id_prenda",
        prenda.id_prenda
    );

    await bitacoraService.registrar({
        idUsuario,
        descripcion: "Nueva prenda agregada",
        accion: "INSERT",
        tablaAfectada: "Prenda",
        usuarioAfectado: idUsuario
    });

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

    await digitoVerificadorService.recalcularTabla(
        Prenda,
        "Prenda",
        "id_prenda"
    );
    
    await bitacoraService.registrar({
        idUsuario,
        descripcion: "Prenda eliminada",
        accion: "DELETE",
        tablaAfectada: "Prenda",
        usuarioAfectado: idUsuario
    });

    if (eliminadas === 0) {
        throw new Error("Prenda no encontrada");
    }

    return true;
};

module.exports = {agregarPrenda, obtenerArmario, eliminarPrenda};
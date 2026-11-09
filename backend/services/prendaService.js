const prendaDAO = require("../dao/prendaDAO");
const Prenda = require("../models/prenda");
const digitoVerificadorService = require("./digitoVerificadorService");
const bitacoraService = require("./bitacoraService");

// AGREGAR PRENDA
const agregarPrenda = async (idUsuario, datos) => {
    const datosPrenda = {
        ...datos,
        id_usuario: idUsuario,
        DVH: null
    };

    const prenda = await prendaDAO.crear(
        datosPrenda
    );

    await digitoVerificadorService.recalcularRegistroYTabla(
        Prenda,
        "Prenda",
        "id_prenda",
        prenda.id_prenda
    );

    await bitacoraService.registrar({
        idUsuario: idUsuario,
        descripcion: "Prenda agregada",
        accion: "INSERT",
        tablaAfectada: "Prenda",
        usuarioAfectado: idUsuario
    });

    return prenda;
};

// OBTENER ARMARIO
const obtenerArmario = async (idUsuario) => {
    return await prendaDAO.obtenerPorUsuario(
        idUsuario
    );
};

// ELIMINAR PRENDA
const eliminarPrenda = async (
    idPrenda,
    idUsuario
) => {
    const prenda = await Prenda.findOne({
        where: {
            id_prenda: idPrenda,
            id_usuario: idUsuario
        }
    });

    if (!prenda) {
        throw new Error(
            "Prenda no encontrada"
        );
    }

    const resultado = await prendaDAO.eliminar(
        idPrenda,
        idUsuario
    );

    await digitoVerificadorService.recalcularTabla(
        Prenda,
        "Prenda",
        "id_prenda"
    );

    await bitacoraService.registrar({
        idUsuario: idUsuario,
        descripcion: "Prenda eliminada",
        accion: "DELETE",
        tablaAfectada: "Prenda",
        usuarioAfectado: idUsuario
    });

    return resultado;
};

module.exports = {
    agregarPrenda,
    obtenerArmario,
    eliminarPrenda
};
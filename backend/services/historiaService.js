const historiaDAO = require("../dao/historiaDAO");
const digitoVerificadorService = require("./digitoVerificadorService");
const bitacoraService = require("./bitacoraService");

// REGISTRAR HISTORIA
const registrarHistoria = async (datos) => {
    try {
        const nuevaHistoria = await historiaDAO.crear(datos);

        const Historia = nuevaHistoria.constructor;

        await digitoVerificadorService.recalcularRegistroYTabla(
            Historia,
            "Historia",
            "id_historia",
            nuevaHistoria.id_historia
        );

        await bitacoraService.registrar({
            idUsuario: datos.id_usuario,
            descripcion: "Historia creada",
            accion: "INSERT",
            tablaAfectada: "Historia",
            usuarioAfectado: datos.id_usuario
        });

        return nuevaHistoria;

    } catch (error) {
        throw new Error(
            `Error en Service: ${error.message}`
        );
    }
};

// OBTENER HISTORIAS
const traerTodasLasHistorias = async () => {
    try {
        return await historiaDAO.obtenerTodas();

    } catch (error) {
        throw new Error(
            `Error en Service: ${error.message}`
        );
    }
};

module.exports = {
    registrarHistoria,
    traerTodasLasHistorias
};
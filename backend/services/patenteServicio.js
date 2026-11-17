const patenteDAO = require("../dao/patenteDAO.js");
const digitoVerificadorService = require("./digitoVerificadorService.js");
const Patente = require("../models/patenteModel.js");

// Obtener todas las patentes
const obtenerTodas = async () => {
    return await patenteDAO.obtenerTodas();
};

// Buscar una patente por su ID
const buscarPorId = async (id_patente) => {
    return await patenteDAO.buscarPorId(id_patente);
};

// Buscar una patente por su nombre
const buscarPorNombre = async (nombre_patente) => {
    return await patenteDAO.buscarPorNombre(nombre_patente);
};

// Crear una patente y actualizar sus dígitos verificadores
const crear = async (datos) => {
    const nuevaPatente = await patenteDAO.crear(datos);

    await digitoVerificadorService.recalcularRegistroYTabla(
        Patente,
        "Patente",
        "id_patente",
        nuevaPatente.id_patente
    );

    return await patenteDAO.buscarPorId(nuevaPatente.id_patente);
};

module.exports = {
    obtenerTodas,
    buscarPorId,
    buscarPorNombre,
    crear
};
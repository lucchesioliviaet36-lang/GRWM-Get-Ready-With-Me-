const Patente = require("../models/patenteModel.js");

// Buscar todas las patentes
const obtenerTodas = async () => {
    return await Patente.findAll();
};

// Buscar una patente por su ID
const buscarPorId = async (id_patente) => {
    return await Patente.findByPk(id_patente);
};

// Buscar una patente por su nombre
const buscarPorNombre = async (nombre_patente) => {
    return await Patente.findOne({
        where: { nombre_patente }
    });
};

// Crear una patente
const crear = async (datos) => {
    return await Patente.create(datos);
};

module.exports = {
    obtenerTodas,
    buscarPorId,
    buscarPorNombre,
    crear
};
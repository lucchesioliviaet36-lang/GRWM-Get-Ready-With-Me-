const Historia = require('../models/historiasModel.js');

// CREAR HISTORIA
const crear = async (datosHistoria) => {
    try {
        return await Historia.create(datosHistoria);
    } catch (error) {
        throw new Error(`Error en DAO al crear historia: ${error.message}`);
    }
};

// OBTENER TODAS LAS HISTORIAS
const obtenerTodas = async () => {
    try {
        return await Historia.findAll({
            order: [['fecha_creacion', 'DESC']]
        });
    } catch (error) {
        throw new Error(`Error en DAO al obtener historias: ${error.message}`);
    }
};

module.exports = {
    crear,
    obtenerTodas
};
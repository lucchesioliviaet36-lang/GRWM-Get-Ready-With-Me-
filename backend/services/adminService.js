const Bitacora = require("../models/bitacora");
const DVV = require("../models/dvv");
const integridadService = require("./integridadService");

const obtenerBitacora = async () => {
    return await Bitacora.findAll({
        order: [["id_bitacora", "DESC"]],
        limit: 100
    });
};

const obtenerDVV = async () => {
    return await DVV.findAll({
        order: [["nombre_tabla", "ASC"]]
    });
};

const verificarIntegridad = async () => {
    return await integridadService.verificarIntegridad();
};

module.exports = {
    obtenerBitacora,
    obtenerDVV,
    verificarIntegridad
};
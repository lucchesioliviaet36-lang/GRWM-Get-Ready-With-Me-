const Bitacora = require("../models/bitacora");
const DVV = require("../models/dvv");
const integridadService = require("./integridadService");
const backupService = require("./backupService");
const bitacoraService = require("./bitacoraService");

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

const generarBackup = async (idUsuario) => {
    const backup = await backupService.crearBackup();

    await bitacoraService.registrar({
        idUsuario,
        descripcion: "Backup de base de datos",
        accion: "BACKUP",
        tablaAfectada: "BaseDatos",
        usuarioAfectado: idUsuario
    });

    return backup;
};

module.exports = {
    obtenerBitacora,
    obtenerDVV,
    verificarIntegridad,
    generarBackup
};
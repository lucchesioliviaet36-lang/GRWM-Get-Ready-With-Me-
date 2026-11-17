const rolPatenteDAO = require("../dao/rolPatenteDAO.js");
const digitoVerificadorService = require("./digitoVerificadorService.js");
const RolPatente = require("../models/rolPatenteModel.js");

// Obtener todas las asignaciones
const obtenerTodas = async () => {
    return await rolPatenteDAO.obtenerTodas();
};

// Obtener las patentes de un rol
const obtenerPorRol = async (id_rol) => {
    return await rolPatenteDAO.obtenerPorRol(id_rol);
};

// Obtener los roles de una patente
const obtenerPorPatente = async (id_patente) => {
    return await rolPatenteDAO.obtenerPorPatente(id_patente);
};

// Asignar una patente a un rol y actualizar los dígitos verificadores
const asignarPatente = async (id_rol, id_patente) => {
    const nuevaAsignacion = await rolPatenteDAO.crear({
        id_rol,
        id_patente
    });

    await digitoVerificadorService.recalcularRegistroYTabla(
        RolPatente,
        "Rol_Patente",
        "id_rol_patente",
        nuevaAsignacion.id_rol_patente
    );

    return await RolPatente.findByPk(nuevaAsignacion.id_rol_patente);
};

// Eliminar una asignación y actualizar el DVV
const eliminarAsignacion = async (id_rol_patente) => {
    const eliminada = await rolPatenteDAO.eliminar(id_rol_patente);

    if (eliminada) {
        await digitoVerificadorService.recalcularTabla(
            RolPatente,
            "Rol_Patente",
            "id_rol_patente"
        );
    }

    return eliminada;
};

module.exports = {
    obtenerTodas,
    obtenerPorRol,
    obtenerPorPatente,
    asignarPatente,
    eliminarAsignacion
};
const RolPatente = require("../models/rolPatenteModel.js");

// Buscar todas las relaciones entre roles y patentes
const obtenerTodas = async () => {
    return await RolPatente.findAll();
};

// Buscar las patentes asignadas a un rol
const obtenerPorRol = async (id_rol) => {
    return await RolPatente.findAll({
        where: { id_rol }
    });
};

// Buscar los roles que tienen una patente
const obtenerPorPatente = async (id_patente) => {
    return await RolPatente.findAll({
        where: { id_patente }
    });
};

// Asignar una patente a un rol
const crear = async (datos) => {
    return await RolPatente.create(datos);
};

// Eliminar una asignación
const eliminar = async (id_rol_patente) => {
    return await RolPatente.destroy({
        where: { id_rol_patente }
    });
};

module.exports = {
    obtenerTodas,
    obtenerPorRol,
    obtenerPorPatente,
    crear,
    eliminar
};
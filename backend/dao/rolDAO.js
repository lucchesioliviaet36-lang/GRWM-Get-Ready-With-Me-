const Rol = require("../models/rolModel.js");

// Buscar todos los roles
const obtenerTodos = async () => {
    return await Rol.findAll();
};

// Buscar un rol por su ID
const buscarPorId = async (id_rol) => {
    return await Rol.findByPk(id_rol);
};

// Buscar un rol por su nombre
const buscarPorNombre = async (nombre_rol) => {
    return await Rol.findOne({
        where: { nombre_rol }
    });
};

// Crear un rol
const crear = async (datos) => {
    return await Rol.create(datos);
};

module.exports = {
    obtenerTodos,
    buscarPorId,
    buscarPorNombre,
    crear
};

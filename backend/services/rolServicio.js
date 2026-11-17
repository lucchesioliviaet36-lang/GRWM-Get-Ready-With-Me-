const rolDAO = require("../dao/rolDAO.js");
const digitoVerificadorService = require("./digitoVerificadorService.js");
const Rol = require("../models/rolModel.js");

// Obtener todos los roles
const obtenerTodos = async () => {
    return await rolDAO.obtenerTodos();
};

// Buscar un rol por su ID
const buscarPorId = async (id_rol) => {
    return await rolDAO.buscarPorId(id_rol);
};

// Buscar un rol por su nombre
const buscarPorNombre = async (nombre_rol) => {
    return await rolDAO.buscarPorNombre(nombre_rol);
};

// Crear un rol y actualizar sus dígitos verificadores
const crear = async (datos) => {
    const nuevoRol = await rolDAO.crear(datos);

    await digitoVerificadorService.recalcularRegistroYTabla(
        Rol,
        "Rol",
        "id_rol",
        nuevoRol.id_rol
    );

    return await rolDAO.buscarPorId(nuevoRol.id_rol);
};

module.exports = {
    obtenerTodos,
    buscarPorId,
    buscarPorNombre,
    crear
};
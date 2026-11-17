const UsuarioRol = require("../models/usuarioRolModel.js");

// Buscar todos los roles asignados a usuarios
const obtenerTodos = async () => {
    return await UsuarioRol.findAll();
};

// Buscar los roles de un usuario
const obtenerPorUsuario = async (id_usuario) => {
    return await UsuarioRol.findAll({
        where: { id_usuario }
    });
};

// Buscar los usuarios que tienen un rol
const obtenerPorRol = async (id_rol) => {
    return await UsuarioRol.findAll({
        where: { id_rol }
    });
};

// Asignar un rol a un usuario
const crear = async (datos) => {
    return await UsuarioRol.create(datos);
};

// Eliminar un rol de un usuario
const eliminar = async (id_usuario_rol) => {
    return await UsuarioRol.destroy({
        where: { id_usuario_rol }
    });
};

module.exports = {
    obtenerTodos,
    obtenerPorUsuario,
    obtenerPorRol,
    crear,
    eliminar
};
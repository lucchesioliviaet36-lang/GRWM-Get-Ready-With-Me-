const usuarioRolDAO = require("../dao/usuarioRolDAO.js");
const digitoVerificadorService = require("./digitoVerificadorService.js");
const UsuarioRol = require("../models/usuarioRolModel.js");

// Obtener todas las asignaciones
const obtenerTodos = async () => {
    return await usuarioRolDAO.obtenerTodos();
};

// Obtener los roles de un usuario
const obtenerPorUsuario = async (id_usuario) => {
    return await usuarioRolDAO.obtenerPorUsuario(id_usuario);
};

// Obtener los usuarios que tienen un rol
const obtenerPorRol = async (id_rol) => {
    return await usuarioRolDAO.obtenerPorRol(id_rol);
};

// Asignar un rol a un usuario y actualizar los dígitos verificadores
const asignarRol = async (id_usuario, id_rol) => {
    const nuevaAsignacion = await usuarioRolDAO.crear({
        id_usuario,
        id_rol,
        fecha_asignacion: new Date()
    });

    await digitoVerificadorService.recalcularRegistroYTabla(
        UsuarioRol,
        "Usuario_Rol",
        "id_usuario_rol",
        nuevaAsignacion.id_usuario_rol
    );

    return await UsuarioRol.findByPk(nuevaAsignacion.id_usuario_rol);
};

// Quitar un rol y actualizar el DVV
const quitarRol = async (id_usuario_rol) => {
    const eliminado = await usuarioRolDAO.eliminar(id_usuario_rol);

    if (eliminado) {
        await digitoVerificadorService.recalcularTabla(
            UsuarioRol,
            "Usuario_Rol",
            "id_usuario_rol"
        );
    }

    return eliminado;
};

module.exports = {
    obtenerTodos,
    obtenerPorUsuario,
    obtenerPorRol,
    asignarRol,
    quitarRol
};
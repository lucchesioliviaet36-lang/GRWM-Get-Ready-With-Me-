const { Op } = require("sequelize");
const UsuarioPatente = require("../models/usuarioPatenteModel.js");

// Buscar todas las patentes asignadas directamente a usuarios
const obtenerTodas = async () => {
    return await UsuarioPatente.findAll();
};

// Buscar las patentes de un usuario
const obtenerPorUsuario = async (id_usuario) => {
    return await UsuarioPatente.findAll({
        where: { id_usuario }
    });
};

// Buscar las restricciones vigentes de un usuario
const obtenerRestriccionesVigentes = async (id_usuario) => {
    return await UsuarioPatente.findAll({
        where: {
            id_usuario,
            estado: false,
            [Op.or]: [
                { fecha_vencimiento: null },
                { fecha_vencimiento: { [Op.gt]: new Date() } }
            ]
        }
    });
};

// Asignar una patente a un usuario
const crear = async (datos) => {
    return await UsuarioPatente.create(datos);
};

// Actualizar una asignación o restricción
const actualizar = async (id_usuario_patente, datos) => {
    return await UsuarioPatente.update(datos, {
        where: { id_usuario_patente }
    });
};

// Eliminar una asignación o restricción
const eliminar = async (id_usuario_patente) => {
    return await UsuarioPatente.destroy({
        where: { id_usuario_patente }
    });
};

module.exports = {
    obtenerTodas,
    obtenerPorUsuario,
    obtenerRestriccionesVigentes,
    crear,
    actualizar,
    eliminar
};
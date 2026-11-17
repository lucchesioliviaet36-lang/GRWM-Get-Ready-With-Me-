const usuarioPatenteDAO = require("../dao/usuarioPatenteDAO.js");
const digitoVerificadorService = require("./digitoVerificadorService.js");
const UsuarioPatente = require("../models/usuarioPatenteModel.js");

// Obtener todas las restricciones
const obtenerTodas = async () => {
    return await usuarioPatenteDAO.obtenerTodas();
};

// Obtener las restricciones de un usuario
const obtenerPorUsuario = async (id_usuario) => {
    return await usuarioPatenteDAO.obtenerPorUsuario(id_usuario);
};

// Restringir una acción durante determinada cantidad de días
const restringirAccion = async (id_usuario, id_patente, dias) => {
    const fechaAsignacion = new Date();
    const fechaVencimiento = new Date();

    fechaVencimiento.setDate(fechaVencimiento.getDate() + dias);

    const nuevaRestriccion = await usuarioPatenteDAO.crear({
        id_usuario,
        id_patente,
        fecha_asignacion: fechaAsignacion,
        fecha_vencimiento: fechaVencimiento,
        estado: false
    });

    await digitoVerificadorService.recalcularRegistroYTabla(
        UsuarioPatente,
        "Usuario_Patente",
        "id_usuario_patente",
        nuevaRestriccion.id_usuario_patente
    );

    return await UsuarioPatente.findByPk(
        nuevaRestriccion.id_usuario_patente
    );
};

// Quitar una restricción y actualizar los dígitos verificadores
const quitarRestriccion = async (id_usuario_patente) => {
    await usuarioPatenteDAO.actualizar(id_usuario_patente, {
        estado: true
    });

    await digitoVerificadorService.recalcularRegistroYTabla(
        UsuarioPatente,
        "Usuario_Patente",
        "id_usuario_patente",
        id_usuario_patente
    );

    return await UsuarioPatente.findByPk(id_usuario_patente);
};

module.exports = {
    obtenerTodas,
    obtenerPorUsuario,
    restringirAccion,
    quitarRestriccion
};
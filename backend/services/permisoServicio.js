const patenteServicio = require("./patenteServicio.js");
const rolServicio = require("./rolServicio.js");
const rolPatenteServicio = require("./rolPatenteServicio.js");
const usuarioRolServicio = require("./usuarioRolServicio.js");
const usuarioPatenteDAO = require("../dao/usuarioPatenteDAO.js");

// Comprobar si un usuario tiene permiso para realizar una acción
const tienePermiso = async (id_usuario, nombre_patente) => {

    // Buscar la patente correspondiente a la acción
    const patente = await patenteServicio.buscarPorNombre(nombre_patente);

    if (!patente) {
        return false;
    }

    // Buscar las restricciones individuales del usuario
    const restricciones = await usuarioPatenteDAO.obtenerRestriccionesVigentes(id_usuario);

    const estaRestringido = restricciones.some(
        restriccion => Number(restriccion.id_patente) === Number(patente.id_patente)
    );

    // Si tiene una restricción activa, no puede realizar la acción
    if (estaRestringido) {
        return false;
    }

    // Buscar los roles asignados al usuario
    const rolesUsuario = await usuarioRolServicio.obtenerPorUsuario(id_usuario);

    // Buscar el rol administrador
    const rolAdministrador = await rolServicio.buscarPorNombre("administrador");

    // Si el usuario es administrador, tiene todos los permisos
    if (rolAdministrador && rolesUsuario.some(
        usuarioRol => Number(usuarioRol.id_rol) === Number(rolAdministrador.id_rol)
    )) {
        return true;
    }

    // Comprobar si alguno de sus roles tiene esa patente
    for (const usuarioRol of rolesUsuario) {
        const patentesRol = await rolPatenteServicio.obtenerPorRol(usuarioRol.id_rol);

        const tieneLaPatente = patentesRol.some(
            relacion => Number(relacion.id_patente) === Number(patente.id_patente)
        );

        if (tieneLaPatente) {
            return true;
        }
    }

    return false;
};

module.exports = {
    tienePermiso
};
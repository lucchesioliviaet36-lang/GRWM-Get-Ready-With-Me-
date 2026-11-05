const usuarioDao = require("../dao/usuarioDAO");
const Usuario = require("../models/usuarioModels");
const digitoVerificadorService = require("./digitoVerificadorService");
const bitacoraService = require("./bitacoraService");
const bcrypt = require("bcrypt");

// 1. Obtener datos del usuario por ID
const obtenerPorId = async (id_usuario) => {
    return await usuarioDao.buscarPorId(id_usuario);
};

// 2. Actualizar el perfil en la base de datos
const actualizarPerfil = async (id_usuario, datos) => {
    const usuario = await usuarioDao.buscarPorId(id_usuario);

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    const datosActualizados = {
        nombre: datos.nombre,
        apellido: datos.apellido,
        username: datos.username,
        descripcion: datos.descripcion,
        mail: datos.email,
        telefono: datos.telefono,
        instagram: datos.instagram,
        tiktok: datos.tiktok,
        website: datos.website
    };

    if (datos.foto_perfil) {
        datosActualizados.foto_perfil = datos.foto_perfil;
    }

    if (datos.banner) {
        datosActualizados.banner = datos.banner;
    }

    await usuarioDao.actualizarUsuario(
        id_usuario,
        datosActualizados
    );
    
    await digitoVerificadorService.recalcularRegistroYTabla(
        Usuario,
        "Usuario",
        "id_usuario",
        id_usuario
    );

    await bitacoraService.registrar({
        idUsuario,
        descripcion: "Perfil actualizado",
        accion: "UPDATE",
        tablaAfectada: "Usuario",
        usuarioAfectado: idUsuario
    });

    return await usuarioDao.buscarPorId(id_usuario);
};

// 3. Buscar usuarios
const buscarUsuarios = async (texto, idUsuarioActual) => {
    const busqueda = texto.trim();

    if (!busqueda) {
        return [];
    }

    return await usuarioDao.buscarUsuarios(
        busqueda,
        idUsuarioActual
    );
};

// 4. Eliminar cuenta
const eliminarCuenta = async (id_usuario) => {
    const usuario = await usuarioDao.buscarPorId(id_usuario);

    if (!usuario) {
        throw new Error("El usuario no existe");
    }

    return await usuarioDao.eliminarUsuario(id_usuario);
};

// 5. Cambiar la contraseña del usuario autenticado
const cambiarContraseña = async (
    id_usuario,
    contraseñaActual,
    contraseñaNueva
) => {
    if (!contraseñaActual || !contraseñaNueva) {
        throw new Error("Completá todos los campos de contraseña");
    }

    const usuario = await usuarioDao.buscarPorId(id_usuario);

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    const contraseñaCorrecta = await bcrypt.compare(
        contraseñaActual,
        usuario.contraseña
    );

    if (!contraseñaCorrecta) {
        throw new Error("La contraseña actual es incorrecta");
    }

    const contraseñaHash = await bcrypt.hash(
        contraseñaNueva,
        10
    );

    await usuarioDao.actualizarContraseña(
        id_usuario,
        contraseñaHash
    );

    return true;
};


//SEGUIR Y DEJAR DE SEGUIR

// Seguir a otro usuario
const seguirUsuario = async (id_usuario_seguidor, id_usuario_seguido) => {
    if (Number(id_usuario_seguidor) === Number(id_usuario_seguido)) {
        throw new Error("No podés seguirte a vos mismo");
    }

    const usuario = await usuarioDao.buscarPorId(id_usuario_seguido);

    if (!usuario) {
        throw new Error("El usuario que querés seguir no existe");
    }

    return await usuarioDao.seguirUsuario(
        id_usuario_seguidor,
        id_usuario_seguido
    );
};

// Dejar de seguir a otro usuario
const dejarDeSeguir = async (id_usuario_seguidor, id_usuario_seguido) => {
    return await usuarioDao.dejarDeSeguir(
        id_usuario_seguidor,
        id_usuario_seguido
    );
};

// Obtener cantidad de seguidores y seguidos
const obtenerEstadisticasSeguimiento = async (id_usuario) => {
    const seguidores = await usuarioDao.contarSeguidores(id_usuario);
    const seguidos = await usuarioDao.contarSeguidos(id_usuario);

    return { seguidores, seguidos };
};

// Consultar si el usuario actual sigue al perfil visitado
const obtenerEstadoSeguimiento = async (
    id_usuario_seguidor,
    id_usuario_seguido
) => {
    const seguimiento = await usuarioDao.obtenerSeguimiento(
        id_usuario_seguidor,
        id_usuario_seguido
    );

    return Boolean(seguimiento);
};

// Obtener sugerencias aleatorias
const obtenerSugerencias = async (idUsuarioActual) => {
    return await usuarioDao.obtenerSugerencias(idUsuarioActual);
};

module.exports = {
    obtenerPorId,
    actualizarPerfil,
    buscarUsuarios,
    eliminarCuenta,
    cambiarContraseña,
    seguirUsuario,
    dejarDeSeguir,
    obtenerEstadisticasSeguimiento,
    obtenerEstadoSeguimiento,
    obtenerSugerencias
};
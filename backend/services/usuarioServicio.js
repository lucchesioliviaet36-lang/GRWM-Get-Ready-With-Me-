const usuarioDao = require("../dao/usuarioDAO");
const Usuario = require("../models/usuarioModels");
const digitoVerificadorService = require("./digitoVerificadorService");
const bitacoraService = require("./bitacoraService");
const bcrypt = require("bcrypt");

// 1. OBTENER DATOS DEL USUARIO POR ID
const obtenerPorId = async (id_usuario) => {
    return await usuarioDao.buscarPorId(id_usuario);
};

// 2. ACTUALIZAR PERFIL
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

    await usuarioDao.actualizarUsuario(id_usuario, datosActualizados);

    // ACTUALIZAR DVH Y DVV
    await digitoVerificadorService.recalcularRegistroYTabla(
        Usuario,
        "Usuario",
        "id_usuario",
        id_usuario
    );

    // BITACORA
    await bitacoraService.registrar({
        idUsuario: id_usuario,
        descripcion: "Perfil actualizado",
        accion: "UPDATE",
        tablaAfectada: "Usuario",
        usuarioAfectado: id_usuario
    });

    return await usuarioDao.buscarPorId(id_usuario);
};

// 3. BUSCAR USUARIOS
const buscarUsuarios = async (texto, idUsuarioActual) => {
    const busqueda = texto.trim();

    if (!busqueda) {
        return [];
    }

    return await usuarioDao.buscarUsuarios(busqueda, idUsuarioActual);
};

// 4. ELIMINAR CUENTA
const eliminarCuenta = async (id_usuario) => {
    const usuario = await usuarioDao.buscarPorId(id_usuario);

    if (!usuario) {
        throw new Error("El usuario no existe");
    }

    // BITACORA ANTES DE ELIMINAR
    await bitacoraService.registrar({
        idUsuario: id_usuario,
        descripcion: "Cuenta eliminada",
        accion: "DELETE",
        tablaAfectada: "Usuario",
        usuarioAfectado: id_usuario
    });

    await usuarioDao.eliminarUsuario(id_usuario);

    // COMO EL USUARIO YA NO EXISTE,
    // SOLO RECALCULAMOS EL DVV
    await digitoVerificadorService.recalcularTabla(
        Usuario,
        "Usuario",
        "id_usuario"
    );

    return true;
};

// 5. CAMBIAR CONTRASEÑA
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

    const contraseñaCorrecta = await bcrypt.compare( contraseñaActual, usuario.contraseña );

    if (!contraseñaCorrecta) {
        throw new Error("La contraseña actual es incorrecta");
    }

    const contraseñaHash = await bcrypt.hash(contraseñaNueva, 10);

    await usuarioDao.actualizarContraseña(id_usuario, contraseñaHash);

    await digitoVerificadorService.recalcularRegistroYTabla(
        Usuario,
        "Usuario",
        "id_usuario",
        id_usuario
    );

    await bitacoraService.registrar({
        idUsuario: id_usuario,
        descripcion: "Contraseña modificada",
        accion: "UPDATE",
        tablaAfectada: "Usuario",
        usuarioAfectado: id_usuario
    });

    return true;
};

// SEGUIR USUARIO
const seguirUsuario = async (id_usuario_seguidor, id_usuario_seguido) => {
    if (Number(id_usuario_seguidor) === Number(id_usuario_seguido)) {
        throw new Error("No podés seguirte a vos mismo");
    }

    const usuario = await usuarioDao.buscarPorId(id_usuario_seguido);

    if (!usuario) {
        throw new Error( "El usuario que querés seguir no existe");
    }

    const resultado = await usuarioDao.seguirUsuario(id_usuario_seguidor, id_usuario_seguido);

    await bitacoraService.registrar({
        idUsuario: id_usuario_seguidor,
        descripcion: "Usuario seguido",
        accion: "FOLLOW",
        tablaAfectada: "Seguimiento",
        usuarioAfectado: id_usuario_seguido
    });

    return resultado;
};

// DEJAR DE SEGUIR
const dejarDeSeguir = async (id_usuario_seguidor, id_usuario_seguido) => {
    const resultado = await usuarioDao.dejarDeSeguir(id_usuario_seguidor,id_usuario_seguido);

    await bitacoraService.registrar({
        idUsuario: id_usuario_seguidor,
        descripcion: "Usuario dejado de seguir",
        accion: "UNFOLLOW",
        tablaAfectada: "Seguimiento",
        usuarioAfectado: id_usuario_seguido
    });

    return resultado;
};

// OBTENER ESTADISTICAS
const obtenerEstadisticasSeguimiento = async (id_usuario) => {
    const seguidores = await usuarioDao.contarSeguidores(id_usuario);
    const seguidos = await usuarioDao.contarSeguidos(id_usuario);

    return {seguidores, seguidos};
};

// OBTENER SEGUIDORES
const obtenerListaSeguidores = async (id_usuario) => {
    return await usuarioDao.obtenerListaSeguidores(
        id_usuario
    );
};

// OBTENER SEGUIDOS
const obtenerListaSeguidos = async (id_usuario) => {
    return await usuarioDao.obtenerListaSeguidos(
        id_usuario
    );
};

// ESTADO SEGUIMIENTO
const obtenerEstadoSeguimiento = async (id_usuario_seguidor, id_usuario_seguido) => {
    const seguimiento = await usuarioDao.obtenerSeguimiento(id_usuario_seguidor, id_usuario_seguido);

    return Boolean(seguimiento);
};

// SUGERENCIAS
const obtenerSugerencias = async (idUsuarioActual) => {
    return await usuarioDao.obtenerSugerencias(
        idUsuarioActual
    );
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
    obtenerSugerencias,
    obtenerListaSeguidores,
    obtenerListaSeguidos
};
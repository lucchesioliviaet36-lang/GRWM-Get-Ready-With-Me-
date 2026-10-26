const usuarioDao = require("../dao/usuarioDAO");
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

module.exports = {
    obtenerPorId,
    actualizarPerfil,
    buscarUsuarios,
    eliminarCuenta,
    cambiarContraseña
};
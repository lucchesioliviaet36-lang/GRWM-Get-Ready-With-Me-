const usuarioDao = require("../dao/usuarioDAO");

class UsuarioServicio {

    // 🟢 1. Obtener datos del usuario por ID
    async obtenerPorId(id_usuario) {
        return await usuarioDao.buscarPorId(id_usuario);
    }

    // 🟢 2. Actualizar el perfil en la base de datos
    async actualizarPerfil(id_usuario, datosNuevos) {
        const usuario = await usuarioDao.buscarPorId(id_usuario);
        if (!usuario) {
            throw new Error("El usuario no existe");
        }
        // Llama al DAO para hacer el UPDATE en MySQL
        return await usuarioDao.actualizarUsuario(id_usuario, datosNuevos);
    }

    // 🟢 3. Buscar usuarios (Ya lo tenías)
    async buscarUsuarios(texto, idUsuarioActual) {
        const busqueda = texto.trim();

        if (!busqueda) {
            return [];
        }

        return await usuarioDao.buscarUsuarios(
            busqueda,
            idUsuarioActual
        );
    }

    // 🟢 4. Eliminar cuenta (Ya lo tenías)
    async eliminarCuenta(id_usuario) {
        const usuario = await usuarioDao.buscarPorId(id_usuario);
        
        if (!usuario) {
            throw new Error("El usuario no existe");
        }

        return await usuarioDao.eliminarUsuario(id_usuario);
    }

}

module.exports = new UsuarioServicio();
const usuarioDao = require("../dao/usuarioDAO");

class UsuarioServicio {

    // 🟢 1. Obtener datos del usuario por ID
    async obtenerPorId(id_usuario) {
        return await usuarioDao.buscarPorId(id_usuario);
    }

    // 🟢 2. Actualizar el perfil en la base de datos
    async actualizarPerfil(id_usuario, datos) {
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
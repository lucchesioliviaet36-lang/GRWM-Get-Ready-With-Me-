const usuarioDao = require("../dao/usuarioDAO");

class UsuarioServicio {

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


    async eliminarCuenta(id_usuario) {

        const usuario = await usuarioDao.buscarPorId(id_usuario);
        
        if (!usuario) {
            throw new Error("El usuario no existe");
        }

        return await usuarioDao.eliminarUsuario(id_usuario);
    }

}

module.exports = new UsuarioServicio();
const usuarioDao = require("../dao/usuarioDAO");

class UsuarioServicio {

    async eliminarCuenta(id_usuario) {

        const usuario = await usuarioDao.buscarPorId(id_usuario);
        
        if (!usuario) {
            throw new Error("El usuario no existe");
        }

        return await usuarioDao.eliminar(id_usuario);
    }

}

module.exports = new UsuarioServicio();
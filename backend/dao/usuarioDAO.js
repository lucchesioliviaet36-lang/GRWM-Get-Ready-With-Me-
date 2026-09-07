const Usuario = require("../models/usuarioModels.js");

class UsuarioDao {

    async buscarPorUsername(username) {
        return await Usuario.findOne({
            where: {
                username: username
            }
        });
    }

    async buscarPorMail(mail) {
        return await Usuario.findOne({
            where: {
                mail: mail
            }
        });
    }

    async buscarPorId(id_usuario) {
        return await Usuario.findByPk(id_usuario);
    }

    async crear(usuario) {
        return await Usuario.create(usuario);
    }

}

module.exports = new UsuarioDao();
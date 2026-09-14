const { Op } = require("sequelize");
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

    async buscarUsuarios(texto, idUsuarioActual) {
        return await Usuario.findAll({
            where: {
                [Op.and]: [
                    {
                        id_usuario: {
                            [Op.ne]: idUsuarioActual
                        }
                    },
                    {
                        [Op.or]: [
                            {
                                username: {
                                    [Op.like]: `%${texto}%`
                                }
                            },
                            {
                                nombre: {
                                    [Op.like]: `%${texto}%`
                                }
                            },
                            {
                                apellido: {
                                    [Op.like]: `%${texto}%`
                                }
                            }
                        ]
                    }
                ]
            },

            // IMPORTANTE:
            // no devolver contraseña ni mail
            attributes: [
                "id_usuario",
                "nombre",
                "apellido",
                "username",
                "descripcion"
            ],

            limit: 20,

            order: [
                ["username", "ASC"]
            ]
        });
    }

    async crear(usuario) {
        return await Usuario.create(usuario);
    }

    async eliminar(id_usuario) {
        return await Usuario.destroy({
            where: {
                id_usuario: id_usuario
            }
        });
    }

}

module.exports = new UsuarioDao();
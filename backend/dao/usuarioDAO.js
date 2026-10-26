const { Op } = require("sequelize");
const Usuario = require("../models/usuarioModels.js");

class UsuarioDao {

    async buscarParaInicioSesion (identificador) {
        return await Usuario.findOne({
            where: {
                [Op.or]: [
                    {username: identificador},
                    {mail: identificador}
                ]
            }
        });
    };

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

            // IMPORTANTE: no devolver contraseña ni mail
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

    // NUEVO: Función para guardar los cambios de perfil en MySQL mediante Sequelize
    async actualizarUsuario(id_usuario, datos) {
        return await Usuario.update(
            {
                nombre: datos.nombre,
                apellido: datos.apellido,
                username: datos.username,
                descripcion: datos.descripcion,
                mail: datos.email || datos.mail,
                telefono: datos.telefono,
                foto_perfil: datos.foto_perfil,
                banner: datos.banner
            },
            {
                where: { id_usuario }
            }
        );

    }

    // Actualizar únicamente la contraseña del usuario
    async actualizarContraseña(id_usuario, contraseñaHash) {
        return await Usuario.update(
            {
                contraseña: contraseñaHash
            },
            {
                where: { id_usuario }
            }
        );
    }

    async actualizarIntentos(id_usuario, cantidad, bloqueadoHasta = null){
        await Usuario.update(
            {
                intentos_fallidos: cantidad,
                bloqueado_hasta: bloqueadoHasta
            },
            {
                where:{id_usuario}
            }
        );
    }

    async reiniciarIntentos(id_usuario){
        await Usuario.update(
            {
                intentos_fallidos: 0,
                bloqueado_hasta: null
            },
            {
                where: {id_usuario}
            }
        );
    }

    async guardarTokenRecuperacion(idUsuario, tokenHash, fechaExpiracion) {
        return await Usuario.update(
            {
                reset_password: tokenHash,
                reset_password_expira: fechaExpiracion
            },
            {
                where: {
                    id_usuario: idUsuario
                }
            }
        );
    }

    async buscarPorTokenRecuperacion(tokenHash) {
        return await Usuario.findOne({
            where: {
                reset_password: tokenHash,

                reset_password_expira: {
                    [Op.gt]: new Date()
                }
            }
        });
    }

    async actualizarContrasenaRecuperada(idUsuario, contraseñaHash) {
        return await Usuario.update(
            {
                contraseña: contraseñaHash,
                reset_password: null,
                reset_password_expira: null
            },
            {
                where: {
                    id_usuario: idUsuario
                }
            }
        );
    }

    async eliminarUsuario(id_usuario) {
        // Obtenemos los modelos registrados en Sequelize
        const models = Usuario.sequelize ? Usuario.sequelize.models : {};

        // Borramos en orden los registros asociados para no romper las claves foráneas
        if (models.Seguridad) await models.Seguridad.destroy({ where: { id_usuario } });
        if (models.Usuario_Rol) await models.Usuario_Rol.destroy({ where: { id_usuario } });
        if (models.Usuario_Patente) await models.Usuario_Patente.destroy({ where: { id_usuario } });
        if (models.Soporte) await models.Soporte.destroy({ where: { id_usuario } });
        if (models.Seguidores) await models.Seguidores.destroy({ where: { id_usuario } });
        if (models.Bitacora) await models.Bitacora.destroy({ where: { id_usuario } });
        if (models.Publicacion) await models.Publicacion.destroy({ where: { id_usuario } });
        if (models.Producto) await models.Producto.destroy({ where: { id_usuario } });

        // Finalmente eliminamos el usuario de la tabla Usuario
        return await Usuario.destroy({ where: { id_usuario } });
    }

}

module.exports = new UsuarioDao();
const { Op } = require("sequelize");
const Usuario = require("../models/usuarioModels.js");

// Buscar usuario por username o mail para iniciar sesión
const buscarParaInicioSesion = async (identificador) => {
    return await Usuario.findOne({
        where: {
            [Op.or]: [
                { username: identificador },
                { mail: identificador }
            ]
        }
    });
};

// Buscar por username
const buscarPorUsername = async (username) => {
    return await Usuario.findOne({
        where: { username }
    });
};

// Buscar por mail
const buscarPorMail = async (mail) => {
    return await Usuario.findOne({
        where: { mail }
    });
};

// Buscar por ID
const buscarPorId = async (id_usuario) => {
    return await Usuario.findByPk(id_usuario);
};

// Buscar usuarios excluyendo al usuario actual
const buscarUsuarios = async (texto, idUsuarioActual) => {
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
        // No devolver contraseña ni mail
        attributes: [
            "id_usuario",
            "nombre",
            "apellido",
            "username",
            "descripcion"
        ],
        limit: 20,
        order: [["username", "ASC"]]
    });
};

// Crear usuario
const crear = async (usuario) => {
    return await Usuario.create(usuario);
};

// Actualizar perfil
const actualizarUsuario = async (id_usuario, datos) => {
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
};

// Actualizar únicamente la contraseña
const actualizarContraseña = async (id_usuario, contraseñaHash) => {
    return await Usuario.update(
        {
            contraseña: contraseñaHash
        },
        {
            where: { id_usuario }
        }
    );
};

// Actualizar intentos fallidos de inicio de sesión
const actualizarIntentos = async (
    id_usuario,
    cantidad,
    bloqueadoHasta = null
) => {
    return await Usuario.update(
        {
            intentos_fallidos: cantidad,
            bloqueado_hasta: bloqueadoHasta
        },
        {
            where: { id_usuario }
        }
    );
};

// Reiniciar intentos fallidos
const reiniciarIntentos = async (id_usuario) => {
    return await Usuario.update(
        {
            intentos_fallidos: 0,
            bloqueado_hasta: null
        },
        {
            where: { id_usuario }
        }
    );
};

// Guardar token de recuperación
const guardarTokenRecuperacion = async (
    idUsuario,
    tokenHash,
    fechaExpiracion
) => {
    return await Usuario.update(
        {
            reset_password: tokenHash,
            reset_password_expira: fechaExpiracion
        },
        {
            where: { id_usuario: idUsuario }
        }
    );
};

// Buscar token de recuperación vigente
const buscarPorTokenRecuperacion = async (tokenHash) => {
    return await Usuario.findOne({
        where: {
            reset_password: tokenHash,
            reset_password_expira: {
                [Op.gt]: new Date()
            }
        }
    });
};

// Actualizar contraseña recuperada y eliminar el token de recuperación
const actualizarContrasenaRecuperada = async (
    idUsuario,
    contraseñaHash
) => {
    return await Usuario.update(
        {
            contraseña: contraseñaHash,
            reset_password: null,
            reset_password_expira: null
        },
        {
            where: { id_usuario: idUsuario }
        }
    );
};

// Eliminar usuario y sus registros asociados
const eliminarUsuario = async (id_usuario) => {
    // Obtener los modelos registrados en Sequelize
    const models = Usuario.sequelize
        ? Usuario.sequelize.models
        : {};

    // Eliminar registros asociados para evitar conflictos con claves foráneas
    if (models.Seguridad) {
        await models.Seguridad.destroy({ where: { id_usuario } });
    }

    if (models.Usuario_Rol) {
        await models.Usuario_Rol.destroy({ where: { id_usuario } });
    }

    if (models.Usuario_Patente) {
        await models.Usuario_Patente.destroy({ where: { id_usuario } });
    }

    if (models.Soporte) {
        await models.Soporte.destroy({ where: { id_usuario } });
    }

    if (models.Seguidores) {
        await models.Seguidores.destroy({ where: { id_usuario } });
    }

    if (models.Bitacora) {
        await models.Bitacora.destroy({ where: { id_usuario } });
    }

    if (models.Publicacion) {
        await models.Publicacion.destroy({ where: { id_usuario } });
    }

    if (models.Producto) {
        await models.Producto.destroy({ where: { id_usuario } });
    }

    // Finalmente, eliminar al usuario
    return await Usuario.destroy({
        where: { id_usuario }
    });
};

module.exports = {
    buscarParaInicioSesion,
    buscarPorUsername,
    buscarPorMail,
    buscarPorId,
    buscarUsuarios,
    crear,
    actualizarUsuario,
    actualizarContraseña,
    actualizarIntentos,
    reiniciarIntentos,
    guardarTokenRecuperacion,
    buscarPorTokenRecuperacion,
    actualizarContrasenaRecuperada,
    eliminarUsuario
};
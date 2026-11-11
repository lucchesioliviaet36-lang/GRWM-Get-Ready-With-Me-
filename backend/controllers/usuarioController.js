const usuarioServicio = require("../services/usuarioServicio");

// 1. Obtener perfil del usuario logueado
const obtenerPerfil = async (req, res) => {
    try {
        const id_usuario = req.user.id_usuario || req.user.id;

        const usuario = await usuarioServicio.obtenerPorId(id_usuario);

        return res.status(200).json({
            success: true,
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                username: usuario.username,
                mail: usuario.mail,
                descripcion: usuario.descripcion,
                foto_perfil: usuario.foto_perfil,
                banner: usuario.banner
            }
        });

    } catch (error) {
        console.error("Error al obtener perfil:", error);

        return res.status(500).json({
            success: false,
            mensaje: "Error al obtener perfil"
        });
    }
};

// 2. Actualizar perfil
const actualizarPerfil = async (req, res) => {
    try {
        const idUsuario = req.user.id_usuario;

        const datos = {
            ...req.body
        };

        if (
            req.files &&
            req.files.foto_perfil &&
            req.files.foto_perfil.length > 0
        ) {
            datos.foto_perfil =
                `/uploads/perfiles/${req.files.foto_perfil[0].filename}`;
        }

        if (
            req.files &&
            req.files.banner &&
            req.files.banner.length > 0
        ) {
            datos.banner =
                `/uploads/perfiles/${req.files.banner[0].filename}`;
        }

        const usuario =
            await usuarioServicio.actualizarPerfil(
                idUsuario,
                datos
            );

        return res.status(200).json({
            success: true,
            usuario
        });

    } catch (error) {
        console.error(
            "Error actualizando perfil:",
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 3. Buscar usuarios
const buscarUsuarios = async (req, res) => {
    try {
        const texto = req.query.q || "";
        const idUsuarioActual = req.user.id_usuario;

        const usuarios = await usuarioServicio.buscarUsuarios(
            texto,
            idUsuarioActual
        );

        return res.status(200).json({
            success: true,
            usuarios
        });

    } catch (error) {
        console.error("Error buscando usuarios:", error);

        return res.status(500).json({
            success: false,
            mensaje: "Error al buscar usuarios"
        });
    }
};

// 4. Eliminar cuenta
const eliminarCuenta = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                mensaje: "Se requiere el ID del usuario"
            });
        }

        await usuarioServicio.eliminarCuenta(id);

        return res.status(200).json({
            mensaje: "Cuenta eliminada correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar la cuenta:", error);

        return res.status(500).json({
            mensaje: error.message || "Error al eliminar la cuenta"
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const usuario = await usuarioServicio.obtenerPorId(req.params.id);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const perfilPublico = {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            username: usuario.username,
            foto_perfil: usuario.foto_perfil,
            banner: usuario.banner,
            descripcion: usuario.descripcion
        };

        return res.status(200).json({ success: true, usuario: perfilPublico });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//SEGUIR Y DEJAR DE SEGUIR

// 6. Seguir a otro usuario
const seguirUsuario = async (req, res) => {
    try {
        // El usuario que sigue se obtiene del token
        const id_usuario_seguidor = req.user.id_usuario;

        // El usuario al que queremos seguir viene de la URL
        const id_usuario_seguido = Number(req.params.id);

        if (!id_usuario_seguido) {
            return res.status(400).json({
                success: false,
                mensaje: "ID de usuario inválido"
            });
        }

        await usuarioServicio.seguirUsuario(
            id_usuario_seguidor,
            id_usuario_seguido
        );

        return res.status(201).json({
            success: true,
            mensaje: "Ahora seguís a este usuario"
        });

    } catch (error) {
        console.error("Error al seguir usuario:", error);

        return res.status(400).json({
            success: false,
            mensaje: error.message
        });
    }
};

// 7. Dejar de seguir a otro usuario
const dejarDeSeguir = async (req, res) => {
    try {
        const id_usuario_seguidor = req.user.id_usuario;
        const id_usuario_seguido = Number(req.params.id);

        if (!id_usuario_seguido) {
            return res.status(400).json({
                success: false,
                mensaje: "ID de usuario inválido"
            });
        }

        await usuarioServicio.dejarDeSeguir(
            id_usuario_seguidor,
            id_usuario_seguido
        );

        return res.status(200).json({
            success: true,
            mensaje: "Dejaste de seguir a este usuario"
        });

    } catch (error) {
        console.error("Error al dejar de seguir:", error);

        return res.status(500).json({
            success: false,
            mensaje: "No se pudo dejar de seguir al usuario"
        });
    }
};

// 8. Obtener cantidad de seguidores y seguidos
const obtenerEstadisticasSeguimiento = async (req, res) => {
    try {
        const id_usuario = Number(req.params.id);

        if (!id_usuario) {
            return res.status(400).json({
                success: false,
                mensaje: "ID de usuario inválido"
            });
        }

        const estadisticas =
            await usuarioServicio.obtenerEstadisticasSeguimiento(id_usuario);

        return res.status(200).json({
            success: true,
            ...estadisticas
        });

    } catch (error) {
        console.error("Error al obtener estadísticas:", error);

        return res.status(500).json({
            success: false,
            mensaje: "No se pudieron obtener las estadísticas"
        });
    }
};

// Consultar si el usuario actual sigue a otro
const obtenerEstadoSeguimiento = async (req, res) => {
    try {
        const id_usuario_seguidor = req.user.id_usuario;
        const id_usuario_seguido = Number(req.params.id);

        const loSigo = await usuarioServicio.obtenerEstadoSeguimiento(
            id_usuario_seguidor,
            id_usuario_seguido
        );

        return res.status(200).json({
            success: true,
            loSigo
        });

    } catch (error) {
        console.error("Error consultando seguimiento:", error);

        return res.status(500).json({
            success: false,
            mensaje: "No se pudo consultar el seguimiento"
        });
    }
};

// Obtener sugerencias de usuarios
const obtenerSugerencias = async (req, res) => {
    try {
        const idUsuarioActual = req.user.id_usuario;

        const usuarios = await usuarioServicio.obtenerSugerencias(
            idUsuarioActual
        );

        return res.status(200).json({
            success: true,
            usuarios
        });

    } catch (error) {
        console.error("Error al obtener sugerencias:", error);

        return res.status(500).json({
            success: false,
            mensaje: "No se pudieron obtener las sugerencias"
        });
    }
};

// Obtener lista de seguidores
const obtenerListaSeguidores = async (req, res) => {
    try {
        const id_usuario = Number(req.params.id);

        if (!id_usuario) {
            return res.status(400).json({
                mensaje: "ID de usuario inválido"
            });
        }

        const usuarios = await usuarioServicio.obtenerListaSeguidores(id_usuario);

        return res.status(200).json({
            success: true,
            usuarios
        });

    } catch (error) {
        console.error("Error al obtener seguidores:", error);

        return res.status(500).json({
            mensaje: "No se pudieron obtener los seguidores"
        });
    }
};

// Obtener lista de seguidos
const obtenerListaSeguidos = async (req, res) => {
    try {
        const id_usuario = Number(req.params.id);

        if (!id_usuario) {
            return res.status(400).json({
                mensaje: "ID de usuario inválido"
            });
        }

        const usuarios = await usuarioServicio.obtenerListaSeguidos(id_usuario);

        return res.status(200).json({
            success: true,
            usuarios
        });

    } catch (error) {
        console.error("Error al obtener seguidos:", error);

        return res.status(500).json({
            mensaje: "No se pudieron obtener los usuarios seguidos"
        });
    }
};

module.exports = {
    obtenerPerfil,
    actualizarPerfil,
    buscarUsuarios,
    eliminarCuenta,
    obtenerPorId,
    seguirUsuario,
    dejarDeSeguir,
    obtenerEstadisticasSeguimiento,
    obtenerEstadoSeguimiento,
    obtenerSugerencias,
    obtenerListaSeguidores,
    obtenerListaSeguidos
};

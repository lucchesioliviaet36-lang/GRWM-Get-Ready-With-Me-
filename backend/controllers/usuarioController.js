const usuarioServicio = require("../services/usuarioServicio");

// 1. Obtener perfil del usuario logueado
const obtenerPerfil = async (req, res) => {
    try {
        const id_usuario = req.user.id_usuario || req.user.id;

        const usuario = await usuarioServicio.obtenerPorId(id_usuario);

        return res.status(200).json({
            success: true,
            usuario
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

        return res.status(200).json({ success: true, usuario });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    obtenerPerfil,
    actualizarPerfil,
    buscarUsuarios,
    eliminarCuenta,
    obtenerPorId
};
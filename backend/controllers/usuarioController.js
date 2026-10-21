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
        const id_usuario = req.user.id_usuario || req.user.id;
        const datosNuevos = req.body;

        await usuarioServicio.actualizarPerfil(
            id_usuario,
            datosNuevos
        );

        return res.status(200).json({
            success: true,
            mensaje: "Perfil actualizado correctamente en la base de datos"
        });

    } catch (error) {
        console.error("Error al actualizar perfil:", error);

        return res.status(500).json({
            success: false,
            mensaje: "Error al actualizar perfil"
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

module.exports = {
    obtenerPerfil,
    actualizarPerfil,
    buscarUsuarios,
    eliminarCuenta
};
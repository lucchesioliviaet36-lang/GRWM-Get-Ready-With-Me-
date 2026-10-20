const usuarioServicio = require("../services/usuarioServicio");

class usuarioController {


    // 1. Obtener perfil del usuario logueado
    async obtenerPerfil(req, res) {
        try {
            const id_usuario = req.user.id_usuario || req.user.id;
            const usuario = await usuarioServicio.obtenerPorId(id_usuario);
            return res.status(200).json({ success: true, usuario });
        } catch (error) {
            console.error("Error al obtener perfil:", error);
            return res.status(500).json({ success: false, mensaje: "Error al obtener perfil" });
        }
    }

    // 2. Actualizar perfil en la base de datos
    async actualizarPerfil(req, res) {
        try {
            const id_usuario = req.user.id_usuario || req.user.id;
            const datosNuevos = req.body;

            await usuarioServicio.actualizarPerfil(id_usuario, datosNuevos);

            return res.status(200).json({
                success: true,
                mensaje: "Perfil actualizado correctamente en la base de datos"
            });
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            return res.status(500).json({ success: false, mensaje: "Error al actualizar perfil" });
        }
    }

    async buscarUsuarios(req, res) {
        try {

            const texto = req.query.q || "";

            const idUsuarioActual =
                req.user.id_usuario;

            const usuarios =
                await usuarioServicio.buscarUsuarios(
                    texto,
                    idUsuarioActual
                );

            return res.status(200).json({
                success: true,
                usuarios
            });

        } catch (error) {

            console.error(
                "Error buscando usuarios:",
                error
            );

            return res.status(500).json({
                success: false,
                mensaje:
                    "Error al buscar usuarios"
            });
        }
    }


    async eliminarCuenta(req, res) {
        try {

            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    mensaje:
                        "Se requiere el ID del usuario"
                });
            }

            await usuarioServicio.eliminarCuenta(id);

            res.status(200).json({
                mensaje:
                    "Cuenta eliminada correctamente"
            });

        } catch (error) {

            console.error(
                "Error al eliminar la cuenta:",
                error
            );

            res.status(500).json({ 
                mensaje:
                    error.message ||
                    "Error al eliminar la cuenta" 
            });
        }
    }

}

module.exports = new usuarioController();
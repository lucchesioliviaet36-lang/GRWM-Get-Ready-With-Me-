const usuarioServicio = require("../services/usuarioServicio");

class usuarioController {

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
const usuarioServicio = require("../services/usuarioServicio");

class usuarioController {

    async eliminarCuenta(req, res) {
        try {
            const { id } = req.params; 

            if (!id) {
                return res.status(400).json({ mensaje: "Se requiere el ID del usuario" });
            }

            await usuarioServicio.eliminarCuenta(id);

            res.status(200).json({ mensaje: "Cuenta eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la cuenta:", error);
            res.status(500).json({ 
                mensaje: error.message || "Error al eliminar la cuenta" 
            });
        }
    }

}

module.exports = new usuarioController();

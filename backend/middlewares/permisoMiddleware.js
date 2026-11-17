const permisoServicio = require("../services/permisoServicio.js");

const verificarPermiso = (nombre_patente) => {
    return async (req, res, next) => {
        try {
            const id_usuario = req.user.id_usuario;

            const tienePermiso = await permisoServicio.tienePermiso(
                id_usuario,
                nombre_patente
            );

            if (!tienePermiso) {
                return res.status(403).json({
                    mensaje: "No tenés permiso para realizar esta acción."
                });
            }

            next();

        } catch (error) {
            console.error("Error al verificar permisos:", error);

            res.status(500).json({
                mensaje: "Error al comprobar los permisos."
            });
        }
    };
};

module.exports = verificarPermiso;
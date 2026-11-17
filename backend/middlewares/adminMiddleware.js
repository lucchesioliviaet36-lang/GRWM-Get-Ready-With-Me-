const usuarioRolServicio = require("../services/usuarioRolServicio.js");
const rolServicio = require("../services/rolServicio.js");

const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Usuario no autenticado"
            });
        }

        // Buscar el rol administrador
        const rolAdministrador = await rolServicio.buscarPorNombre("administrador");

        if (!rolAdministrador) {
            return res.status(403).json({
                success: false,
                message: "No existe el rol administrador"
            });
        }

        // Buscar los roles del usuario
        const rolesUsuario = await usuarioRolServicio.obtenerPorUsuario(
            req.user.id_usuario
        );

        // Comprobar si tiene el rol administrador
        const esAdministrador = rolesUsuario.some(
            usuarioRol => Number(usuarioRol.id_rol) === Number(rolAdministrador.id_rol)
        );

        if (!esAdministrador) {
            return res.status(403).json({
                success: false,
                message: "No tenés permisos de administrador"
            });
        }

        next();

    } catch (error) {
        console.error("Error al verificar administrador:", error);

        return res.status(500).json({
            success: false,
            message: "Error al comprobar los permisos de administrador"
        });
    }
};

module.exports = adminMiddleware;
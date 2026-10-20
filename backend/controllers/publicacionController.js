const publicacionService = require("../services/publicacionService.js");

const crearPublicacion = async (req, res) => {
    try {
        const { descripcion, id_producto } = req.body;
        const id_usuario = req.user.id_usuario;

        if (!id_usuario) {
            return res.status(401).json({
                error: "No se pudo identificar al usuario autenticado"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                error: "Falta la imagen de la publicación"
            });
        }

        const imagen_url = `/uploads/publicaciones/${req.file.filename}`;

        const nuevaPublicacion = await publicacionService.crearPublicacion(
            descripcion,
            Number(id_usuario),
            id_producto ? Number(id_producto) : null,
            imagen_url
        );

        return res.status(201).json(nuevaPublicacion);

    } catch (error) {
        console.error("Error al crear publicación:", error);

        return res.status(500).json({
            error: "Error al guardar la publicación",
            detalle: error.message
        });
    }
};

const obtenerPublicaciones = async (req, res) => {
    try {
        const publicaciones =
            await publicacionService.obtenerPublicaciones();

        return res.status(200).json(publicaciones);

    } catch (error) {
        console.error("Error al obtener publicaciones:", error);

        return res.status(500).json({
            error: "Error al consultar las publicaciones"
        });
    }
};

const eliminarPublicacion = async (req, res) => {
    try {
        const { id_publicacion } = req.params;

        const filasAfectadas =
            await publicacionService.eliminarPublicacion(id_publicacion);

        if (filasAfectadas > 0) {
            return res.status(200).json({
                mensaje: "Publicación eliminada con éxito"
            });
        }

        return res.status(404).json({
            error: "No se encontró la publicación"
        });

    } catch (error) {
        console.error("Error al eliminar publicación:", error);

        return res.status(500).json({
            error: "Error al eliminar en la base de datos"
        });
    }
};

const obtenerFavoritosPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const favoritos =
            await publicacionService.obtenerFavoritosPorUsuario(id_usuario);

        return res.status(200).json(favoritos);

    } catch (error) {
        console.error("Error al obtener favoritos del usuario:", error);

        return res.status(500).json({
            error: "Error al obtener favoritos"
        });
    }
};

module.exports = {
    crearPublicacion,
    obtenerPublicaciones,
    eliminarPublicacion,
    obtenerFavoritosPorUsuario
};
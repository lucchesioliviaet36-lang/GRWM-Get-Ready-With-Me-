const publicacionService = require("../services/publicacionService.js");

class PublicacionController {
    async crearPublicacion(req, res) {
        try {
            const { descripcion, id_usuario, id_producto } = req.body;

            if (!id_usuario) {
                return res.status(400).json({ error: "Falta el id_usuario" });
            }

            if (!req.file) {
                return res.status(400).json({ error: "Falta la imagen de la publicación" });
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
    }

    async obtenerPublicaciones(req, res) {
        try {
            const publicaciones = await publicacionService.obtenerPublicaciones();
            res.status(200).json(publicaciones);
        } catch (error) {
            console.error("Error al obtener publicaciones:", error);
            res.status(500).json({ error: "Error al consultar las publicaciones" });
        }
    }

    async eliminarPublicacion(req, res) {
        try {
            const { id_publicacion } = req.params;
            const filasAfectadas = await publicacionService.eliminarPublicacion(id_publicacion);

            if (filasAfectadas > 0) {
                res.status(200).json({ mensaje: "Publicación eliminada con éxito" });
            } else {
                res.status(404).json({ error: "No se encontró la publicación" });
            }
        } catch (error) {
            console.error("Error al eliminar publicación:", error);
            res.status(500).json({ error: "Error al eliminar en la base de datos" });
        }
    }

    async obtenerFavoritosPorUsuario(req, res) {
        try {
            const { id_usuario } = req.params;
            const favoritos = await publicacionService.obtenerFavoritosPorUsuario(id_usuario);
            res.status(200).json(favoritos);
        } catch (error) {
            console.error("Error al obtener favoritos del usuario:", error);
            res.status(500).json({ error: "Error al obtener favoritos" });
        }
    }

    

}

module.exports = new PublicacionController();
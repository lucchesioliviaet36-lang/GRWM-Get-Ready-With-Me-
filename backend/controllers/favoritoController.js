const favoritoService = require("../services/favoritoService.js");

class FavoritoController {
    async toggleFavorito(req, res) {
        try {
            // Lee 'id' o 'id_publicacion' para asegurar que nunca sea undefined
            const id_publicacion = req.params.id || req.params.id_publicacion;
            const { id_usuario } = req.query;

            if (!id_usuario || !id_publicacion) {
                return res.status(400).json({ error: "Faltan datos requeridos (id_usuario o id_publicacion)" });
            }

            const resultado = await favoritoService.toggleFavorito(id_usuario, id_publicacion);
            res.status(200).json(resultado);
        } catch (error) {
            console.error("Error al procesar favorito:", error);
            res.status(500).json({ error: "Error al guardar en favoritos" });
        }
    }

    async obtenerEstadoFavorito(req, res) {
        try {
            // Lee 'id' o 'id_publicacion' para asegurar que nunca sea undefined
            const id_publicacion = req.params.id || req.params.id_publicacion;
            const { id_usuario } = req.query;

            if (!id_usuario || !id_publicacion) {
                return res.status(400).json({ error: "Faltan datos requeridos" });
            }

            const resultado = await favoritoService.obtenerEstadoFavorito(id_usuario, id_publicacion);
            res.status(200).json(resultado);
        } catch (error) {
            console.error("Error al consultar favorito:", error);
            res.status(500).json({ error: "Error al consultar estado de favorito" });
        }
    }

    // Método para traer las publicaciones guardadas a la pestaña "Favoritos" de perfil_propio
    async obtenerFavoritosPorUsuario(req, res) {
        try {
            const { id_usuario } = req.params;
            const lista = await favoritoService.obtenerFavoritosPorUsuario(id_usuario);
            res.status(200).json(lista);
        } catch (error) {
            console.error("Error al obtener lista de favoritos:", error);
            res.status(500).json({ error: "Error al obtener lista de favoritos" });
        }
    }
}

module.exports = new FavoritoController();
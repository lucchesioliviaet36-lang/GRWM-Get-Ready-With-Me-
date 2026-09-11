const likeService = require("../services/likeService.js");

class LikeController {
    async alternarLike(req, res) {
        try {
            const { id_publicacion } = req.params;
            
            // Usamos opcional chaining (?.) para que NUNCA rompa si req.body es undefined
            const id_usuario = req.body?.id_usuario || req.query?.id_usuario;

            if (!id_usuario || !id_publicacion) {
                return res.status(400).json({ 
                    error: "Falta el id_usuario o el id_publicacion" 
                });
            }

            const resultado = await likeService.alternarLike(id_usuario, id_publicacion);
            res.status(200).json(resultado);
        } catch (error) {
            console.error("Error al alternar me gusta:", error);
            res.status(500).json({ error: "Error al procesar el me gusta" });
        }
    }

    async obtenerLikes(req, res) {
        try {
            const { id_publicacion } = req.params;
            const { id_usuario } = req.query;

            const resultado = await likeService.obtenerLikesPublicacion(id_publicacion, id_usuario);
            res.status(200).json(resultado);
        } catch (error) {
            console.error("Error al consultar likes:", error);
            res.status(500).json({ error: "Error al consultar los likes" });
        }
    }
}

module.exports = new LikeController();

const likeService = require("../services/likeService.js");

const alternarLike = async (req, res) => {
    try {
        const { id_publicacion } = req.params;
        const id_usuario = req.user?.id_usuario;

        if (!id_usuario || !id_publicacion) {
            return res.status(400).json({
                error: "Falta el id_usuario o el id_publicacion"
            });
        }

        const resultado = await likeService.alternarLike(
            id_usuario,
            id_publicacion
        );

        return res.status(200).json(resultado);

    } catch (error) {
        console.error("Error al alternar me gusta:", error);

        return res.status(500).json({
            error: "Error al procesar el me gusta"
        });
    }
};

const obtenerLikes = async (req, res) => {
    try {
        const { id_publicacion } = req.params;
        const { id_usuario } = req.query;

        const resultado = await likeService.obtenerLikesPublicacion(
            id_publicacion,
            id_usuario
        );

        return res.status(200).json(resultado);

    } catch (error) {
        console.error("Error al consultar likes:", error);

        return res.status(500).json({
            error: "Error al consultar los likes"
        });
    }
};

module.exports = {
    alternarLike,
    obtenerLikes
};
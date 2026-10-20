const comentarioService = require("../services/comentarioService.js");

class ComentarioController {

  async obtenerComentarios(req, res) {
    try {
      const { id_publicacion } = req.params;

      const comentarios =
        await comentarioService.obtenerComentarios(id_publicacion);

      res.status(200).json(comentarios);

    } catch (error) {
      console.error("Error al obtener comentarios:", error);

      res.status(500).json({
        error: "Error al obtener los comentarios"
      });
    }
  }


  async crearComentario(req, res) {
    try {
      const { id_publicacion } = req.params;

      // El usuario sale del TOKEN
      const id_usuario = req.user.id_usuario;

      // Del frontend solamente necesitamos el comentario
      const { comentario } = req.body;

      if (!comentario || comentario.trim() === "") {
        return res.status(400).json({
          error: "El comentario es obligatorio."
        });
      }

      const resultado = await comentarioService.crearComentario(
        id_publicacion,
        id_usuario,
        comentario.trim()
      );

      res.status(201).json({
        mensaje: "Comentario guardado correctamente",
        resultado
      });

    } catch (error) {
      console.error("Error al crear comentario:", error);

      res.status(500).json({
        error: "Error al guardar el comentario"
      });
    }
  }


  async eliminarComentario(req, res) {
    try {
      const { id_comentario } = req.params;

      // El usuario sale del TOKEN
      const id_usuario = req.user.id_usuario;

      await comentarioService.eliminarComentario(
        id_comentario,
        id_usuario
      );

      res.status(200).json({
        mensaje: "Comentario eliminado correctamente"
      });

    } catch (error) {
      console.error("Error al eliminar comentario:", error);

      res.status(500).json({
        error: "Error al eliminar el comentario"
      });
    }
  }
}

module.exports = new ComentarioController();
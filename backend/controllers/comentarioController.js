const comentarioService = require("../services/comentarioService.js");

class ComentarioController {
  async obtenerComentarios(req, res) {
    try {
      const { id_publicacion } = req.params;
      const comentarios = await comentarioService.obtenerComentarios(id_publicacion);
      res.status(200).json(comentarios);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
      res.status(500).json({ error: "Error al obtener los comentarios" });
    }
  }

  async crearComentario(req, res) {
    try {
      const { id_publicacion } = req.params;
      const { id_usuario, comentario } = req.body;

      if (!id_usuario || !comentario || comentario.trim() === "") {
        return res.status(400).json({ error: "Faltan datos obligatorios para comentar." });
      }

      const resultado = await comentarioService.crearComentario(
        id_publicacion,
        id_usuario,
        comentario.trim()
      );

      res.status(201).json({ mensaje: "Comentario guardado correctamente", resultado });
    } catch (error) {
      console.error("Error al crear comentario:", error);
      res.status(500).json({ error: "Error al guardar el comentario" });
    }
  }
}

module.exports = new ComentarioController();
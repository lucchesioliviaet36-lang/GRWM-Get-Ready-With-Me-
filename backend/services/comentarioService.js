const comentarioDAO = require("../dao/comentarioDAO.js");

class ComentarioService {
  async obtenerComentarios(id_publicacion) {
    return await comentarioDAO.obtenerComentariosPorPublicacion(id_publicacion);
  }

  async crearComentario(id_publicacion, id_usuario, comentario) {
    return await comentarioDAO.crearComentario(id_publicacion, id_usuario, comentario);
  }

  async eliminarComentario(id_comentario, id_usuario) {
    return await comentarioDAO.eliminarComentario(id_comentario, id_usuario);
  }
}

module.exports = new ComentarioService();
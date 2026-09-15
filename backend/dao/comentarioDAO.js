const { sequelize } = require("../config/database.js");
const { QueryTypes } = require("sequelize");

class ComentarioDAO {
  // 📩 Obtener comentarios con el username del usuario
  async obtenerComentariosPorPublicacion(id_publicacion) {
    const comentarios = await sequelize.query(
      `SELECT c.id_comentario, c.comentario, c.fecha_comentario, u.id_usuario, u.username, u.nombre
       FROM Publicacion_Comentario c
       JOIN Usuario u ON c.id_usuario = u.id_usuario
       WHERE c.id_publicacion = :id_publicacion
       ORDER BY c.fecha_comentario ASC`,
      {
        replacements: { id_publicacion },
        type: QueryTypes.SELECT
      }
    );
    return comentarios;
  }

  // 💬 Insertar nuevo comentario
  async crearComentario(id_publicacion, id_usuario, comentario) {
    return await sequelize.query(
      `INSERT INTO Publicacion_Comentario (comentario, id_usuario, id_publicacion)
       VALUES (:comentario, :id_usuario, :id_publicacion)`,
      {
        replacements: { comentario, id_usuario, id_publicacion }
      }
    );
  }

  // 🗑️ Eliminar comentario (validando que sea del usuario)
  async eliminarComentario(id_comentario, id_usuario) {
    return await sequelize.query(
      `DELETE FROM Publicacion_Comentario 
       WHERE id_comentario = :id_comentario AND id_usuario = :id_usuario`,
      {
        replacements: { id_comentario, id_usuario }
      }
    );
  }
}

module.exports = new ComentarioDAO();
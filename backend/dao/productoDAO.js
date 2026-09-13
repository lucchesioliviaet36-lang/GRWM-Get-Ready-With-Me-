const Producto = require("../models/producto.js");

class ProductoDao {

  async buscarPorNombre(nombre) {
    return await Producto.findAll({
      where: {
        nombre
      }
    });
  }

  async buscarPorCategoria(categoria) {
    return await Producto.findAll({
      where: {
        categoria
      }
    });
  }

  async buscarPorId(id_producto) {
    return await Producto.findByPk(id_producto);
  }

  async buscarPorUsuario(id_usuario) {
    return await Producto.findAll({
      where: {
        id_usuario,
        estado_producto: true
      },
      order: [["fecha", "DESC"]]
    });
  }

  async crear(producto) {
    return await Producto.create(producto);
  }

  async eliminar(id_producto, id_usuario) {
    return await Producto.destroy({
      where: {
        id_producto,
        id_usuario
      }
    });
  }
}

module.exports = new ProductoDao();
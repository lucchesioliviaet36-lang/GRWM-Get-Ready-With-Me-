const productoDAO = require("../dao/productoDAO.js");

class ProductoService {

  async agregarProducto(idUsuario, datos, archivo) {

    const {
      nombre,
      categoria,
      descripcion,
      precio
    } = datos;

    if (!nombre || !categoria || !precio) {
      throw new Error("Nombre, categoría y precio son obligatorios");
    }

    if (!archivo) {
      throw new Error("Debe seleccionar una imagen");
    }

    if (Number(precio) <= 0) {
      throw new Error("El precio debe ser mayor a cero");
    }

    const producto = await productoDAO.crear({
      nombre,
      categoria,
      descripcion: descripcion || null,
      precio,
      imagen: `/uploads/productos/${archivo.filename}`,
      fecha: new Date(),
      estado_producto: true,
      id_usuario: idUsuario,
      DVH: null
    });

    return producto;
  }

  async obtenerProductosUsuario(idUsuario) {
    return await productoDAO.buscarPorUsuario(idUsuario);
  }

  async eliminarProducto(idProducto, idUsuario) {

    const producto = await productoDAO.buscarPorId(idProducto);

    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    if (producto.id_usuario !== idUsuario) {
      throw new Error("No tiene permiso para eliminar este producto");
    }

    await productoDAO.eliminar(idProducto, idUsuario);
  }
}

module.exports = new ProductoService();
const Producto = require("../models/producto.js");

// Buscar productos por nombre
const buscarPorNombre = async (nombre) => {
  return await Producto.findAll({
    where: {
      nombre
    }
  });
};

// Buscar productos por categoría
const buscarPorCategoria = async (categoria) => {
  return await Producto.findAll({
    where: {
      categoria
    }
  });
};

// Buscar producto por ID
const buscarPorId = async (id_producto) => {
  return await Producto.findByPk(id_producto);
};

// Buscar productos activos de un usuario
const buscarPorUsuario = async (id_usuario) => {
  return await Producto.findAll({
    where: {
      id_usuario,
      estado_producto: true
    },
    order: [["fecha", "DESC"]]
  });
};

// Buscar todos los productos activos
const buscarTodosActivos = async () => {
  return await Producto.findAll({
    where: {
      estado_producto: true
    },
    order: [["fecha", "DESC"]]
  });
};

// Crear producto
const crear = async (producto) => {
  return await Producto.create(producto);
};

// Eliminar producto de un usuario
const eliminar = async (id_producto, id_usuario) => {
  return await Producto.destroy({
    where: {
      id_producto,
      id_usuario
    }
  });
};

module.exports = {
  buscarPorNombre,
  buscarPorCategoria,
  buscarPorId,
  buscarPorUsuario,
  buscarTodosActivos,
  crear,
  eliminar
};
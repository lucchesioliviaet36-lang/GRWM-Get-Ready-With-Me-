const {QueryTypes} = require("sequelize");
const {sequelize} = require("../config/database.js");
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

const buscarPorUsuario = async (id_usuario) => {
  return await Producto.findAll({
    where: {id_usuario},
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

// PRODUCTOS PARA MOSTRAR EN UN PERFIL
const buscarProductosPerfil = async (id_usuario) => {
  return await sequelize.query(`
    SELECT
      p.*,

      COALESCE((
        SELECT ROUND(AVG(c.puntuacion), 1)
        FROM Calificacion c
        WHERE c.id_producto = p.id_producto
      ), 0) AS promedio_calificacion,

      (
        SELECT COUNT(*)
        FROM Calificacion c
        WHERE c.id_producto = p.id_producto
      ) AS cantidad_calificaciones

    FROM Producto p

    WHERE p.id_usuario = :id_usuario

    ORDER BY p.fecha DESC, p.id_producto DESC
  `, {
    replacements: {id_usuario},
    type: QueryTypes.SELECT
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
  buscarProductosPerfil,
  crear,
  eliminar
};
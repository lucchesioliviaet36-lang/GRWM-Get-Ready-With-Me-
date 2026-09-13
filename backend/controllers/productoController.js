const productoService = require("../services/productoServicio");

const agregar = async (req, res) => {
  try {

    const idUsuario = req.user.id_usuario;

    const producto =
      await productoService.agregarProducto(
        idUsuario,
        req.body,
        req.file
      );

    return res.status(201).json({
      success: true,
      producto
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
};


const obtenerProductos = async (req, res) => {
  try {

    const idUsuario = req.user.id_usuario;

    const productos =
      await productoService.obtenerProductosUsuario(
        idUsuario
      );

    return res.status(200).json({
      success: true,
      productos
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


const eliminar = async (req, res) => {
  try {

    const idUsuario = req.user.id_usuario;

    const { id } = req.params;

    await productoService.eliminarProducto(
      id,
      idUsuario
    );

    return res.status(200).json({
      success: true,
      message: "Producto eliminado correctamente"
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message: error.message
    });

  }
};


module.exports = { agregar, obtenerProductos, eliminar };
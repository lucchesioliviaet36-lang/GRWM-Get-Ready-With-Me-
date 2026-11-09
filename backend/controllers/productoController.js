
const productoService = require("../services/productoServicio");
const compraServicio = require("../services/compraServicio");

const agregar = async (req, res) => {
  try {
    const idUsuario = req.user.id_usuario;

    const producto = await productoService.agregarProducto(
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

    console.log("Usuario que consulta MiTienda:", idUsuario);

    const productos =
      await productoService.obtenerProductosUsuario(idUsuario);

    console.log("Productos encontrados:", productos.length);

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

const obtenerProductosGenerales = async (req, res) => {
  try {
    const productos =
      await productoService.obtenerProductosGenerales();

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

const obtenerPorId = async (req, res) => {
  try {
    const producto = await productoService.obtenerProductoPorId(req.params.id);
    return res.status(200).json({success: true, producto});
  } catch (error) {
    return res.status(404).json({success: false, message: error.message});
  }
};

const eliminar = async (req, res) => {
  try {
    const idUsuario = req.user.id_usuario;
    const { id } = req.params;

    await productoService.eliminarProducto(id, idUsuario);

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

// NUEVA FUNCIÓN: comprar un producto
const comprar = async (req, res) => {
  try {
    const idUsuario = req.user.id_usuario;
    const { id } = req.params;
    const { metodo } = req.body;

    const compra = await compraServicio.realizarCompra(
      id,
      idUsuario,
      metodo
    );

    return res.status(201).json({
      success: true,
      message: "Compra registrada correctamente",
      compra
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  agregar,
  obtenerProductos,
  eliminar,
  obtenerProductosGenerales,
  obtenerPorId,
  comprar
};

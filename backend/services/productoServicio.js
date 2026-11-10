const productoDAO = require("../dao/productoDAO.js");
const digitoVerificadorService = require("./digitoVerificadorService");
const bitacoraService = require("./bitacoraService");

const agregarProducto = async (idUsuario, datos, archivo) => {
    const {
        nombre,
        categoria,
        descripcion,
        precio
    } = datos;

    if (!nombre || !categoria || !precio) {
        throw new Error(
            "Nombre, categoría y precio son obligatorios"
        );
    }

    if (!archivo) {
        throw new Error(
            "Debe seleccionar una imagen"
        );
    }

    if (Number(precio) <= 0) {
        throw new Error(
            "El precio debe ser mayor a cero"
        );
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

    const Producto = producto.constructor;

    await digitoVerificadorService.recalcularRegistroYTabla(
        Producto,
        "Producto",
        "id_producto",
        producto.id_producto
    );

    await bitacoraService.registrar({
        idUsuario,
        descripcion: "Producto agregado",
        accion: "INSERT",
        tablaAfectada: "Producto",
        usuarioAfectado: idUsuario
    });

    return producto;
};

const obtenerProductosUsuario = async (idUsuario) => {
    return await productoDAO.buscarPorUsuario(idUsuario);
};

const obtenerProductosGenerales = async (idUsuario) => {
  return await productoDAO.buscarTodosActivos(idUsuario);
};

const obtenerProductoPorId = async (idProducto) => {
    const producto = await productoDAO.buscarPorId(idProducto);

    if (!producto) {
        throw new Error("Producto no encontrado");
    }

    return producto;
};

const obtenerProductosPerfil = async (idUsuario) => {
    return await productoDAO.buscarProductosPerfil(idUsuario);
};

const eliminarProducto = async (idProducto, idUsuario) => {
    const producto = await productoDAO.buscarPorId(idProducto);

    if (!producto) {
        throw new Error("Producto no encontrado");
    }

    if (Number(producto.id_usuario) !== Number(idUsuario)) {
        throw new Error(
            "No tiene permiso para eliminar este producto"
        );
    }

    const Producto = producto.constructor;

    await productoDAO.eliminar(idProducto, idUsuario);

    await digitoVerificadorService.recalcularTabla(
        Producto,
        "Producto",
        "id_producto"
    );

    await bitacoraService.registrar({
        idUsuario,
        descripcion: "Producto eliminado",
        accion: "DELETE",
        tablaAfectada: "Producto",
        usuarioAfectado: idUsuario
    });

    return true;
};

module.exports = {
    agregarProducto,
    obtenerProductosUsuario,
    obtenerProductosGenerales,
    obtenerProductoPorId,
    obtenerProductosPerfil,
    eliminarProducto
};
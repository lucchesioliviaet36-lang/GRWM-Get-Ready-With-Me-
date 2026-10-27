const productoDAO = require("../dao/productoDAO.js");

const agregarProducto = async (idUsuario, datos, archivo) => {
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
};

const obtenerProductosUsuario = async (idUsuario) => {
    return await productoDAO.buscarPorUsuario(idUsuario);
};

const obtenerProductosGenerales = async () => {
    return await productoDAO.buscarTodosActivos();
};

const eliminarProducto = async (idProducto, idUsuario) => {
    const producto = await productoDAO.buscarPorId(idProducto);

    if (!producto) {
        throw new Error("Producto no encontrado");
    }

    if (Number(producto.id_usuario) !== Number(idUsuario)) {
        throw new Error("No tiene permiso para eliminar este producto");
    }

    await productoDAO.eliminar(idProducto, idUsuario);
};

module.exports = {
    agregarProducto,
    obtenerProductosUsuario,
    obtenerProductosGenerales,
    eliminarProducto
};
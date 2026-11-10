const pedidoDAO = require("../dao/pedidoDAO");
const Pedido = require("../models/pedido");
const Calificacion = require("../models/calificacion");
const digitoVerificadorService = require("./digitoVerificadorService");
const bitacoraService = require("./bitacoraService");

const obtenerPedido = async (idPedido, idUsuario) => {
    const pedido = await pedidoDAO.buscarPedidoComprador(idPedido, idUsuario);

    if (!pedido) {
        throw new Error("Pedido no encontrado");
    }

    const detalle = await pedidoDAO.buscarDetalle(idPedido);

    if (!detalle) {
        throw new Error(
            "Detalle del pedido no encontrado"
        );
    }

    const producto = await pedidoDAO.buscarProducto(detalle.id_producto);

    if (!producto) {
        throw new Error(
            "Producto no encontrado"
        );
    }

    const calificacion =
        await Calificacion.findOne({
            where: {
                id_usuario: idUsuario,
                id_producto: detalle.id_producto
            }
        });

    return {
        pedido,
        detalle,
        producto,
        calificacion
    };
};

// HISTORIAL DE COMPRAS
const obtenerHistorialCompras = async (idUsuario) => {
    return await pedidoDAO.obtenerHistorialCompras(
        idUsuario
    );
};

const confirmarRecepcion = async (idPedido, idUsuario) => {
    const pedido = await pedidoDAO.buscarPedidoComprador(idPedido, idUsuario);

    if (!pedido) throw new Error("Pedido no encontrado");

    const detalle = await pedidoDAO.buscarDetalle(idPedido);

    if (!detalle) throw new Error("Detalle del pedido no encontrado");

    if (!pedido.recibido) {
        await pedido.update({
            recibido: true,
            fecha_entrega: new Date(),
            estado_pedido: 2
        });

        await digitoVerificadorService.recalcularRegistroYTabla(
            Pedido,
            "Pedido",
            "id_pedido",
            pedido.id_pedido
        );

        await bitacoraService.registrar({
            idUsuario,
            descripcion: "Pedido recibido",
            accion: "UPDATE",
            tablaAfectada: "Pedido",
            usuarioAfectado: idUsuario
        });
    }

    return {
        idPedido: pedido.id_pedido,
        idProducto: detalle.id_producto
    };
};

module.exports = {
    obtenerPedido,
    obtenerHistorialCompras,
    confirmarRecepcion
};
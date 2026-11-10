const {QueryTypes} = require("sequelize");
const {sequelize} = require("../config/database");
const Pedido = require("../models/pedido");
const DetallePedido = require("../models/detallePedido");
const Producto = require("../models/producto");


// BUSCAR PEDIDO DEL COMPRADOR
const buscarPedidoComprador = async (idPedido, idUsuario) => {
    return await Pedido.findOne({
        where: {
            id_pedido: idPedido,
            id_usuario: idUsuario
        }
    });
};


// BUSCAR DETALLE
const buscarDetalle = async (idPedido) => {
    return await DetallePedido.findOne({
        where: {
            id_pedido: idPedido
        }
    });
};


// BUSCAR PRODUCTO
const buscarProducto = async (idProducto) => {
    return await Producto.findByPk(idProducto);
};


// HISTORIAL DE COMPRAS
const obtenerHistorialCompras = async (idUsuario) => {
    return await sequelize.query(`
        SELECT
            pe.id_pedido,
            pe.fecha_pedido,
            pe.estado_pedido,
            pe.recibido,
            pe.fecha_entrega,

            d.id_detalle,
            d.sub_total,
            d.codigo_seguimiento,

            p.id_producto,
            p.nombre,
            p.descripcion,
            p.precio,
            p.categoria,
            p.imagen,

            pa.metodo,
            pa.monto,
            pa.estado_pago,

            c.id_calificacion,
            c.puntuacion,
            c.comentario

        FROM Pedido pe

        INNER JOIN Detalle_Pedido d
            ON d.id_pedido = pe.id_pedido

        INNER JOIN Producto p
            ON p.id_producto = d.id_producto

        LEFT JOIN Pago pa
            ON pa.id_pedido = pe.id_pedido

        LEFT JOIN Calificacion c
            ON c.id_usuario = pe.id_usuario
            AND c.id_producto = p.id_producto

        WHERE pe.id_usuario = :idUsuario

        ORDER BY pe.id_pedido DESC
    `, {
        replacements: {
            idUsuario
        },
        type: QueryTypes.SELECT
    });
};


module.exports = {
    buscarPedidoComprador,
    buscarDetalle,
    buscarProducto,
    obtenerHistorialCompras
};
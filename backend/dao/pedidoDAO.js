const Pedido = require("../models/pedido");
const DetallePedido = require("../models/detallePedido");
const Producto = require("../models/producto");

const buscarPedidoComprador = async (idPedido, idUsuario) => {
    return await Pedido.findOne({
        where: {
            id_pedido: idPedido,
            id_usuario: idUsuario
        }
    });
};

const buscarDetalle = async (idPedido) => {
    return await DetallePedido.findOne({
        where: {id_pedido: idPedido}
    });
};

const buscarProducto = async (idProducto) => {
    return await Producto.findByPk(idProducto);
};

module.exports = {
    buscarPedidoComprador,
    buscarDetalle,
    buscarProducto
};
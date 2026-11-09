const Usuario = require("../models/usuarioModels");
const Producto = require("../models/producto");
const Pedido = require("../models/pedido");
const DetallePedido = require("../models/detallePedido");
const Pago = require("../models/pago");

const buscarUsuario = async (idUsuario, transaction = null, lock = false) => {
    return await Usuario.findByPk(idUsuario, {
        transaction,
        lock: lock && transaction ? transaction.LOCK.UPDATE : undefined
    });
};

const buscarProducto = async (idProducto, transaction = null, lock = false) => {
    return await Producto.findByPk(idProducto, {
        transaction,
        lock: lock && transaction ? transaction.LOCK.UPDATE : undefined
    });
};

const actualizarSaldo = async (idUsuario, saldo, transaction = null) => {
    return await Usuario.update({saldo}, {where: {id_usuario: idUsuario}, transaction});
};

const actualizarProducto = async (idProducto, datos, transaction = null) => {
    return await Producto.update(datos, {where: {id_producto: idProducto}, transaction});
};

const crearPedido = async (datos, transaction = null) => {
    return await Pedido.create(datos, {transaction});
};

const crearDetalle = async (datos, transaction = null) => {
    return await DetallePedido.create(datos, {transaction});
};

const crearPago = async (datos, transaction = null) => {
    return await Pago.create(datos, {transaction});
};

module.exports = {
    buscarUsuario,
    buscarProducto,
    actualizarSaldo,
    actualizarProducto,
    crearPedido,
    crearDetalle,
    crearPago
};
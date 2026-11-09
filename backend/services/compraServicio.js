
const { sequelize } = require("../config/database.js");

const Producto = require("../models/producto");
const Pedido = require("../models/pedido");
const DetallePedido = require("../models/detallePedido");
const Pago = require("../models/pago");

const realizarCompra = async (idProducto, idUsuario, metodo) => {
  if (!["tarjeta", "efectivo"].includes(metodo)) {
  throw new Error("El método de pago seleccionado no es válido");
}

  return await sequelize.transaction(async (transaction) => {

    // 1. Buscar el producto y bloquearlo durante la compra
    const producto = await Producto.findByPk(idProducto, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!producto) {
      throw new Error("El producto no existe");
    }

    // 2. Comprobar que siga disponible
    if (!producto.estado_producto) {
      throw new Error("Este producto ya fue vendido");
    }

    // 3. Evitar que el vendedor compre su propio producto
    if (Number(producto.id_usuario) === Number(idUsuario)) {
      throw new Error("No podés comprar tu propio producto");
    }

    // 4. Obtener precio y fecha
    const precio = Number(producto.precio);
    const fecha = new Date().toISOString().slice(0, 10);

    // 5. Crear el pedido
    const pedido = await Pedido.create(
      {
        fecha_pedido: fecha,
        estado_pedido: true,
        id_usuario: idUsuario,
        DVH: null
      },
      { transaction }
    );

    // 6. Registrar el producto dentro del pedido
    const detalle = await DetallePedido.create(
      {
        cantidad: 1,
        sub_total: precio,
        codigo_seguimiento: null,
        id_pedido: pedido.id_pedido,
        id_producto: producto.id_producto,
        DVH: null
      },
      { transaction }
    );

    // 7. Registrar el pago
    const pago = await Pago.create(
      {
        metodo,
        codigo_transaccion: null,
        monto: precio,
        fecha_pago: fecha,
        estado_pago: true,
        id_pedido: pedido.id_pedido,
        DVH: null
      },
      { transaction }
    );

    // 8. Marcar el producto como vendido
    producto.estado_producto = false;

    await producto.save({ transaction });

    // 9. Devolver los datos de la compra
    return {
      pedido,
      detalle,
      pago,
      producto
    };
  });
};

module.exports = {
  realizarCompra
};

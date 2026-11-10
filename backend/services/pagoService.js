const crypto = require("crypto");
const {sequelize} = require("../config/database");
const pagoDAO = require("../dao/pagoDAO");
const Usuario = require("../models/usuarioModels");
const Producto = require("../models/producto");
const Pedido = require("../models/pedido");
const DetallePedido = require("../models/detallePedido");
const Pago = require("../models/pago");
const digitoVerificadorService = require("./digitoVerificadorService");
const bitacoraService = require("./bitacoraService");

const aCentavos = (valor) => Math.round(Number(valor) * 100);
const aDecimal = (centavos) => (centavos / 100).toFixed(2);

const obtenerSaldo = async (idUsuario) => {
    const usuario = await pagoDAO.buscarUsuario(idUsuario);
    if (!usuario) throw new Error("Usuario no encontrado");

    return usuario.saldo;
};

const cargarSaldo = async (idUsuario, monto) => {
    if (!monto || Number(monto) <= 0) throw new Error("El monto debe ser mayor a cero");

    const nuevoSaldo = await sequelize.transaction(async (transaction) => {
        const usuario = await pagoDAO.buscarUsuario(idUsuario, transaction, true);

        if (!usuario) throw new Error("Usuario no encontrado");

        const saldoActual = aCentavos(usuario.saldo);
        const montoCarga = aCentavos(monto);

        if (montoCarga <= 0) throw new Error("Monto inválido");

        const saldoFinal = saldoActual + montoCarga;

        await pagoDAO.actualizarSaldo(idUsuario, aDecimal(saldoFinal), transaction);

        return aDecimal(saldoFinal);
    });

    await digitoVerificadorService.recalcularRegistroYTabla(
        Usuario,
        "Usuario",
        "id_usuario",
        idUsuario
    );

    await bitacoraService.registrar({
        idUsuario,
        descripcion: "Saldo cargado",
        accion: "UPDATE",
        tablaAfectada: "Usuario",
        usuarioAfectado: idUsuario
    });

    return nuevoSaldo;
};

const comprarEnEfectivo = async (idUsuario, idProducto) => {
    const resultado = await sequelize.transaction(async (transaction) => {

        const producto = await pagoDAO.buscarProducto(
            idProducto,
            transaction,
            true
        );

        if (!producto || !producto.estado_producto) {
            throw new Error("Producto no disponible");
        }

        if (Number(producto.id_usuario) === Number(idUsuario)) {
            throw new Error("No podés comprar tu propio producto");
        }

        const stockActual = Number(producto.stock || 0);

        if (stockActual <= 0) {
            throw new Error("Producto sin stock");
        }

        const precio = aCentavos(producto.precio);

        const pedido = await pagoDAO.crearPedido({
            fecha_pedido: new Date(),
            estado_pedido: 1,
            recibido: false,
            fecha_entrega: null,
            id_usuario: idUsuario,
            DVH: null
        }, transaction);

        const detalle = await pagoDAO.crearDetalle({
            cantidad: 1,
            sub_total: aDecimal(precio),
            codigo_seguimiento: crypto.randomInt(
                100000,
                999999
            ),
            id_pedido: pedido.id_pedido,
            id_producto: producto.id_producto,
            DVH: null
        }, transaction);

        const pago = await pagoDAO.crearPago({
            metodo: "efectivo",
            codigo_transaccion: crypto.randomInt(
                100000000,
                999999999
            ),
            monto: aDecimal(precio),
            fecha_pago: new Date(),
            estado_pago: true,
            id_pedido: pedido.id_pedido,
            DVH: null
        }, transaction);

        const nuevoStock =
            stockActual - 1;

        await pagoDAO.actualizarProducto(
            producto.id_producto,
            {
                stock: String(nuevoStock),
                estado_producto:
                    nuevoStock > 0
            },
            transaction
        );

        return {
            pedido,
            detalle,
            pago,
            producto
        };
    });


    await digitoVerificadorService.recalcularRegistroYTabla(
        Producto,
        "Producto",
        "id_producto",
        resultado.producto.id_producto
    );

    await digitoVerificadorService.recalcularRegistroYTabla(
        Pedido,
        "Pedido",
        "id_pedido",
        resultado.pedido.id_pedido
    );

    await digitoVerificadorService.recalcularRegistroYTabla(
        DetallePedido,
        "Detalle_Pedido",
        "id_detalle",
        resultado.detalle.id_detalle
    );

    await digitoVerificadorService.recalcularRegistroYTabla(
        Pago,
        "Pago",
        "id_pago",
        resultado.pago.id_pago
    );


    await bitacoraService.registrar({
        idUsuario,
        descripcion: "Compra en efectivo",
        accion: "INSERT",
        tablaAfectada: "Pedido",
        usuarioAfectado: idUsuario
    });


    return {
        pedido: resultado.pedido
    };
};

// COMPRAR PRODUCTO
const comprarProducto = async (idUsuario, idProducto) => {
    const resultado = await sequelize.transaction(async (transaction) => {
        const comprador = await pagoDAO.buscarUsuario(idUsuario, transaction, true);
        const producto = await pagoDAO.buscarProducto(idProducto, transaction, true);

        if (!comprador) throw new Error("Usuario no encontrado");
        if (!producto || !producto.estado_producto) throw new Error("Producto no disponible");

        if (Number(producto.id_usuario) === Number(idUsuario)) {
            throw new Error("No podés comprar tu propio producto");
        }

        const vendedor = await pagoDAO.buscarUsuario(producto.id_usuario, transaction, true);

        if (!vendedor) throw new Error("Vendedor no encontrado");

        const precio = aCentavos(producto.precio);
        const saldoComprador = aCentavos(comprador.saldo);
        const saldoVendedor = aCentavos(vendedor.saldo);

        if (saldoComprador < precio) {
            const error = new Error("Saldo insuficiente");
            error.codigo = "SALDO_INSUFICIENTE";
            error.saldo = aDecimal(saldoComprador);
            error.total = aDecimal(precio);
            error.faltante = aDecimal(precio - saldoComprador);
            throw error;
        }

        const stockActual = Number(producto.stock || 0);

        if (stockActual <= 0) throw new Error("Producto sin stock");

        await pagoDAO.actualizarSaldo(idUsuario, aDecimal(saldoComprador - precio), transaction);
        await pagoDAO.actualizarSaldo(vendedor.id_usuario, aDecimal(saldoVendedor + precio), transaction);

        const pedido = await pagoDAO.crearPedido({
            fecha_pedido: new Date(),
            estado_pedido: 1,
            recibido: false,
            fecha_entrega: null,
            id_usuario: idUsuario,
            DVH: null
        }, transaction);

        const detalle = await pagoDAO.crearDetalle({
            cantidad: 1,
            sub_total: aDecimal(precio),
            codigo_seguimiento: crypto.randomInt(100000, 999999),
            id_pedido: pedido.id_pedido,
            id_producto: producto.id_producto,
            DVH: null
        }, transaction);

        const pago = await pagoDAO.crearPago({
            metodo: "saldo",
            codigo_transaccion: crypto.randomInt(100000000, 999999999),
            monto: aDecimal(precio),
            fecha_pago: new Date(),
            estado_pago: true,
            id_pedido: pedido.id_pedido,
            DVH: null
        }, transaction);

        const nuevoStock = stockActual - 1;

        await pagoDAO.actualizarProducto(producto.id_producto, {
            stock: String(nuevoStock),
            estado_producto: nuevoStock > 0
        }, transaction);

        return {
            pedido,
            detalle,
            pago,
            producto,
            idVendedor: vendedor.id_usuario,
            saldo: aDecimal(saldoComprador - precio)
        };
    });

    await digitoVerificadorService.recalcularRegistroYTabla(Usuario, "Usuario", "id_usuario", idUsuario);
    await digitoVerificadorService.recalcularRegistroYTabla(Usuario, "Usuario", "id_usuario", resultado.idVendedor);
    await digitoVerificadorService.recalcularRegistroYTabla(Producto, "Producto", "id_producto", resultado.producto.id_producto);
    await digitoVerificadorService.recalcularRegistroYTabla(Pedido, "Pedido", "id_pedido", resultado.pedido.id_pedido);
    await digitoVerificadorService.recalcularRegistroYTabla(DetallePedido, "Detalle_Pedido", "id_detalle", resultado.detalle.id_detalle);
    await digitoVerificadorService.recalcularRegistroYTabla(Pago, "Pago", "id_pago", resultado.pago.id_pago);

    await bitacoraService.registrar({
        idUsuario,
        descripcion: "Compra realizada",
        accion: "INSERT",
        tablaAfectada: "Pedido",
        usuarioAfectado: idUsuario
    });

    return {
        pedido: resultado.pedido,
        saldo: resultado.saldo
    };
};

module.exports = {
    obtenerSaldo,
    cargarSaldo,
    comprarEnEfectivo,
    comprarProducto
};
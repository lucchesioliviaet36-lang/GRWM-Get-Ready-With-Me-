const Calificacion = require("../models/calificacion");
const calificacionDAO = require("../dao/calificacionDAO");
const pedidoDAO = require("../dao/pedidoDAO");
const digitoVerificadorService = require("./digitoVerificadorService");
const bitacoraService = require("./bitacoraService");

const crearCalificacion = async (idUsuario, datos) => {
    const {idPedido, puntuacion, comentario} = datos;

    const pedido = await pedidoDAO.buscarPedidoComprador(idPedido, idUsuario);

    if (!pedido) throw new Error("Pedido no encontrado");

    if (!pedido.recibido) {
        throw new Error("Primero tenés que confirmar que recibiste el pedido");
    }

    const detalle = await pedidoDAO.buscarDetalle(idPedido);

    if (!detalle) throw new Error("Producto del pedido no encontrado");

    const valorPuntuacion = Number(puntuacion);

    if (!Number.isInteger(valorPuntuacion) || valorPuntuacion < 1 || valorPuntuacion > 5) {
        throw new Error("La puntuación debe ser entre 1 y 5");
    }

    const texto = String(comentario || "").trim();

    if (!texto) throw new Error("Escribí un comentario");

    if (texto.length > 50) {
        throw new Error("El comentario puede tener hasta 50 caracteres");
    }

    const existente = await calificacionDAO.buscarExistente(
        idUsuario,
        detalle.id_producto
    );

    if (existente) {
        throw new Error("Ya calificaste esta compra");
    }

    const calificacion = await calificacionDAO.crear({
        comentario: texto,
        puntuacion: valorPuntuacion,
        fecha: new Date(),
        id_usuario: idUsuario,
        id_producto: detalle.id_producto,
        DVH: null
    });

    await digitoVerificadorService.recalcularRegistroYTabla(
        Calificacion,
        "Calificacion",
        "id_calificacion",
        calificacion.id_calificacion
    );

    await bitacoraService.registrar({
        idUsuario,
        descripcion: "Producto calificado",
        accion: "INSERT",
        tablaAfectada: "Calificacion",
        usuarioAfectado: idUsuario
    });

    return calificacion;
};

const obtenerCalificacionesVendedor = async (idVendedor) => {
    const calificaciones = await calificacionDAO.obtenerPorVendedor(idVendedor);

    const promedio = calificaciones.length
        ? calificaciones.reduce((total, item) => total + Number(item.puntuacion), 0) / calificaciones.length
        : 0;

    return {
        promedio: Number(promedio.toFixed(1)),
        cantidad: calificaciones.length,
        calificaciones
    };
};

module.exports = {
    crearCalificacion,
    obtenerCalificacionesVendedor
};
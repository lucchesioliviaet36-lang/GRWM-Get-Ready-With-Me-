const {QueryTypes} = require("sequelize");
const {sequelize} = require("../config/database");
const Calificacion = require("../models/calificacion");

const buscarExistente = async (idUsuario, idProducto) => {
    return await Calificacion.findOne({
        where: {
            id_usuario: idUsuario,
            id_producto: idProducto
        }
    });
};

const crear = async (datos) => {
    return await Calificacion.create(datos);
};

const obtenerPorVendedor = async (idVendedor) => {
    return await sequelize.query(`
        SELECT
            c.id_calificacion,
            c.comentario,
            c.puntuacion,
            c.fecha,
            c.id_producto,
            p.nombre AS producto,
            u.username AS comprador
        FROM Calificacion c
        INNER JOIN Producto p ON p.id_producto = c.id_producto
        INNER JOIN Usuario u ON u.id_usuario = c.id_usuario
        WHERE p.id_usuario = :idVendedor
        ORDER BY c.id_calificacion DESC
    `, {
        replacements: {idVendedor},
        type: QueryTypes.SELECT
    });
};

module.exports = {
    buscarExistente,
    crear,
    obtenerPorVendedor
};
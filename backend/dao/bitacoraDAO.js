const Bitacora = require("../models/bitacora");
const { Op } = require("sequelize");

// OBTENER TODOS LOS REGISTROS CON FILTROS
const obtenerTodos = async (filtros = {}) => {
    const where = {};

    if (filtros.id_usuario) {
        where.id_usuario = filtros.id_usuario;
    }

    if (filtros.accion) {
        where.accion = {
            [Op.like]: `%${filtros.accion}%`
        };
    }

    if (filtros.tabla_afectada) {
        where.tabla_afectada = {
            [Op.like]: `%${filtros.tabla_afectada}%`
        };
    }

    if (filtros.descripcion) {
        where.descripcion = {
            [Op.like]: `%${filtros.descripcion}%`
        };
    }

    if (filtros.fechaDesde || filtros.fechaHasta) {
        where.fecha = {};

        if (filtros.fechaDesde) {
            where.fecha[Op.gte] = new Date(filtros.fechaDesde);
        }

        if (filtros.fechaHasta) {
            const fechaHasta = new Date(filtros.fechaHasta);
            fechaHasta.setDate(fechaHasta.getDate() + 1);

            where.fecha[Op.lt] = fechaHasta;
        }
    }

    return await Bitacora.findAll({
        where,
        order: [["fecha", "DESC"]]
    });
};

module.exports = {
    obtenerTodos
};

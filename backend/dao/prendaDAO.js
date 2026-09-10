const { where } = require("sequelize");
const db = require("../models");
const Prenda = db.Prenda;

const crear = async(datos) => {
    return await Prenda.create(datos);
};

const obtenerPorUsuario = async (idUsuario) => {
    return await Prenda.findAll({
        where: {id_usuario: idUsuario}
    });
};

const eliminar = async (idPrenda, idUsuario) => {
    return await Prenda.destroy({
        where:{ id_prenda: idPrenda, id_usuario: idUsuario}
    });
};

module.exports = {crear, obtenerPorUsuario, eliminar};
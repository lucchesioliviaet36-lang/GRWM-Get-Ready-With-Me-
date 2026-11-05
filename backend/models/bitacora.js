const {DataTypes} = require("sequelize");
const {sequelize} = require("../config/database");

const Bitacora = sequelize.define(
    "Bitacora",
    {
        id_bitacora: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        descripcion: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        accion: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        tabla_afectada: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        usuario_afectado: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        DVH: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        tableName: "Bitacora",
        timestamps: false
    }
);

module.exports = Bitacora;
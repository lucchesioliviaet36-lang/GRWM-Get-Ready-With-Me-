const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const UsuarioPatente = sequelize.define(
    "UsuarioPatente",
    {
        id_usuario_patente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        fecha_asignacion: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        DVH: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        fecha_vencimiento: {
            type: DataTypes.DATE,
            allowNull: true
        },

        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        id_patente: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        tableName: "Usuario_Patente",
        timestamps: false
    }
);

module.exports = UsuarioPatente;
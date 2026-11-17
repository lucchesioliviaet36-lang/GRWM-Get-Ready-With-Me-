const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const UsuarioRol = sequelize.define(
    "UsuarioRol",
    {
        id_usuario_rol: {
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

        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        id_rol: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        tableName: "Usuario_Rol",
        timestamps: false
    }
);

module.exports = UsuarioRol;
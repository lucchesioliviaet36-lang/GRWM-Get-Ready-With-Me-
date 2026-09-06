const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");
const { type } = require("node:os");

const Usuario = sequelize.define(
    "Usuario",
    {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        apellido: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        contraseña: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        rol: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "usuario"
        },

        mail: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        descripcion: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        fecha_registro: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        DVH: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        tableName: "usuario",
        timestamps: false
    }
);

module.exports = Usuario;
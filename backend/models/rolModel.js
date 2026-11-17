const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const Rol = sequelize.define(
    "Rol",
    {
        id_rol: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre_rol: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        descripcion: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        DVH: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        tableName: "Rol",
        timestamps: false
    }
);

module.exports = Rol;
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const Seguidores = sequelize.define(
    "Seguidores",
    {
        id_seguidor: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        fecha: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },

        DVH: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        id_usuario_seguidor: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        id_usuario_seguido: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "Seguidores",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["id_usuario_seguidor", "id_usuario_seguido"]
            }
        ]
    }
);

module.exports = Seguidores;
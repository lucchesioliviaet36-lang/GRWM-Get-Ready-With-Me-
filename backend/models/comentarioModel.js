const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const PublicacionComentario = sequelize.define(
    "PublicacionComentario",
    {
        id_comentario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        comentario: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        fecha_comentario: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        DVH: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_publicacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "Publicacion_Comentario",
        timestamps: false
    }
);

module.exports = PublicacionComentario;
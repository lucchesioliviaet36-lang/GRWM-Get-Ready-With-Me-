const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const PublicacionFavorito = sequelize.define("Publicacion_Favorito", {
    id_favorito: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_guardado: {
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
}, {
    tableName: "Publicacion_Favorito",
    timestamps: false
});

module.exports = PublicacionFavorito;
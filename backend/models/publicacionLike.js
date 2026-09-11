const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const PublicacionLike = sequelize.define("Publicacion_Like", {
    id_like: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_publicacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_like: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "Publicacion_Like",
    timestamps: false
});

module.exports = PublicacionLike;
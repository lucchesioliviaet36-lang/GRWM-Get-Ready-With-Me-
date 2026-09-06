const express = require("express");
const cors = require("cors");
const { sequelize } = require("./config/database.js");
const Usuario = require("./models/usuarioModels.js");
const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensaje: "Backend de GRWM funcionando correctamente"
    });
});

async function startServer() {
    try {
        await sequelize.authenticate();

        console.log("Conexión con MySQL exitosa");
        console.log("Modelo Usuario cargado");

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error al conectar con MySQL:");
        console.error(error);
    }
}

startServer();
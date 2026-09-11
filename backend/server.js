const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { sequelize } = require("./config/database.js");
const Usuario = require("./models/usuarioModels.js");
const authRoutes = require("./routes/authRoutes");
const catalogoRoutes = require("./routes/catalogoRoutes.js");
const prendaRoutes = require("./routes/prendaRoutes");
const Prenda = require("./models/prenda.js");
const usuarioRoutes = require("./routes/usuarioRoutes");
const publicacionRoutes = require("./routes/publicacionRoutes");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/catalogo", catalogoRoutes);
app.use("/api/prendas", prendaRoutes);
app.use("/api/publicaciones", publicacionRoutes);

app.get("/", (req, res) => {
    res.json({
        mensaje: "Backend de GRWM funcionando correctamente"
    });
});

//estamos probando lo de usuarioDAO
async function probarUsuario() {
    try {
        const usuarios = await Usuario.findAll();

        console.log("Usuarios encontrados:", usuarios.length);

    } catch (error) {
        console.error(" Error consultando usuario:");
        console.error(error);
    }
}

async function cantPrendas() {
    try {
        const prendas = await Prenda.findAll();

        console.log("Prendas encontradas:", prendas.length);

    } catch (error) {
        console.error("Error consultando prendas:");
        console.error(error);
    }
}

async function startServer() {
    try {
        await sequelize.authenticate();

        console.log("Conexión con MySQL exitosa");
        console.log("Modelo Usuario cargado");

        await probarUsuario();
        await cantPrendas();

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error al conectar con MySQL:");
        console.error(error);
    }
}

startServer();
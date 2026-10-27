const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { sequelize } = require("./config/database.js");
const Usuario = require("./models/usuarioModels.js");
const authRoutes = require("./routes/authRoutes");
const catalogoRoutes = require("./routes/catalogoRoutes.js");
const prendaRoutes = require("./routes/prendaRoutes");
const Prenda = require("./models/prenda.js");
const usuarioRoutes = require("./routes/usuarioRoutes");
const publicacionRoutes = require("./routes/publicacionRoutes");
const historiaRoutes = require('./routes/historiaRoutes');
const productoRoutes = require("./routes/productoRoutes");
const iaOutfitRoutes = require("./routes/iaOutfitRoutes");
const chatRoutes = require("./routes/chat");
const Mensaje = require("./models/Mensaje");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({limit: "10mb", extended: true}));
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/catalogo", catalogoRoutes);
app.use("/api/prendas", prendaRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/publicaciones", publicacionRoutes);
app.use("/api/productos", productoRoutes);
app.use( "/api/ai", iaOutfitRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/historia", historiaRoutes);

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

        // Crea la tabla del modelo existente solo si todavía no existe.
        await Mensaje.sync();

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

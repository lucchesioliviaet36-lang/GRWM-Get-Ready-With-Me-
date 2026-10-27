const authService = require("../services/authService");
const jwt = require("jsonwebtoken");
const usuarioServicio = require("../services/usuarioServicio");

// Cambiar contraseña
const cambiarContraseña = async (req, res) => {
    try {
        const id_usuario = req.user.id_usuario || req.user.id;

        const {
            contraseñaActual,
            contraseñaNueva,
            confirmarContraseña
        } = req.body;

        if (contraseñaNueva !== confirmarContraseña) {
            return res.status(400).json({
                success: false,
                mensaje: "La nueva contraseña y su confirmación no coinciden"
            });
        }

        await usuarioServicio.cambiarContraseña(
            id_usuario,
            contraseñaActual,
            contraseñaNueva
        );

        return res.status(200).json({
            success: true,
            mensaje: "Contraseña actualizada correctamente"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            mensaje: error.message || "No se pudo cambiar la contraseña"
        });
    }
};

// Registrar usuario
const registrar = async (req, res) => {
    try {
        const nuevoUsuario = await authService.registrar(req.body);

        if (!process.env.JWT_SECRET) {
            throw new Error("Falta configurar JWT_SECRET en el archivo .env");
        }

        const token = jwt.sign(
            {
                id_usuario: nuevoUsuario.id_usuario,
                username: nuevoUsuario.username,
                rol: nuevoUsuario.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        return res.status(201).json({
            success: true,
            mensaje: "Usuario registrado correctamente",
            token,
            usuario: {
                id_usuario: nuevoUsuario.id_usuario,
                nombre: nuevoUsuario.nombre,
                apellido: nuevoUsuario.apellido,
                username: nuevoUsuario.username,
                mail: nuevoUsuario.mail,
                rol: nuevoUsuario.rol
            }
        });

    } catch (error) {
        console.error("ERROR COMPLETO:");
        console.error(error);
        console.error("NAME:", error.name);
        console.error("MESSAGE:", error.message);
        console.error("ERRORS:", error.errors);

        return res.status(400).json({
            mensaje: error.message,
            errores: error.errors
                ? error.errors.map(e => ({
                    campo: e.path,
                    mensaje: e.message,
                    valor: e.value
                }))
                : []
        });
    }
};

// Iniciar sesión
const iniciar_sesion = async (req, res) => {
    try {
        const { identificador, contraseña } = req.body;

        const resultado = await authService.iniciar_sesion(
            identificador,
            contraseña
        );

        return res.status(200).json({
            success: true,
            mensaje: "Inicio de sesión exitoso",
            token: resultado.token,
            usuario: resultado.usuario
        });

    } catch (error) {
        console.error("Error en login:", error.message);

        const bloqueado =
            error.message.includes("bloqueada") ||
            error.message.includes("Alcanzaste los 5 intentos");

        return res.status(bloqueado ? 429 : 401).json({
            success: false,
            mensaje: error.message
        });
    }
};

// Cerrar sesión
const cerrar_sesion = async (req, res) => {
    try {
        return res.status(200).json({
            mensaje: "Sesión cerrada correctamente"
        });

    } catch (error) {
        console.error("Error en logout:", error);

        return res.status(500).json({
            mensaje: "Error al cerrar sesión"
        });
    }
};

module.exports = {
    cambiarContraseña,
    registrar,
    iniciar_sesion,
    cerrar_sesion
};
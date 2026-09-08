const authService = require("../services/authService");

class authController{

    async registrar(req, res){
        try{
            const nuevoUsuario = await authService.registrar(req.body);

            res.status(201).json({mensaje: "Usuario registrado correctamente",
                usuario: {
                    id_usuario: nuevoUsuario.id_usuario,
                    nombre: nuevoUsuario.nombre,
                    apellido: nuevoUsuario.apellido,
                    username: nuevoUsuario.username,
                    mail: nuevoUsuario.mail,
                    rol: nuevoUsuario.rol
                }
            });

        }

        catch (error) {
            res.status(400).json({
                mensaje: error.message
            });
        }
    }

    async iniciar_sesion(req, res) {

        try {
            const {
                username,
                contraseña
            } = req.body;

            const resultado =
                await authService.iniciar_sesion(
                    username,
                    contraseña
                );

            res.status(200).json({
                mensaje: "Inicio de sesión exitoso",
                token: resultado.token,
                usuario: resultado.usuario
            });

        }
        catch (error) {
            console.error("Error en login:", error);
            res.status(401).json({
                mensaje: error.message
            });
        }
    }
}

module.exports = new authController();
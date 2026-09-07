const authService = require("../services/authService");
const AuthService = require("../services/authService");

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
}

module.exports = new authController();
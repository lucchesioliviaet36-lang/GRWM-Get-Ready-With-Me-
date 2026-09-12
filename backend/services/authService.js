const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuarioDAO = require("../dao/usuarioDAO.js");

class AuthService{

    async registrar(datos){
        const{
            nombre,
            apellido,
            username,
            contraseña,
            mail
        } = datos;

        if (!nombre || !apellido || !username || !contraseña || !mail){
            throw new Error("Todos los campos deben completarse");
        }

        const usuarioUsername = await usuarioDAO.buscarPorUsername(username);

        if(usuarioUsername){
            throw new Error("Este Username ya esta registrado");
        }

        const usuarioMail = await usuarioDAO.buscarPorMail(mail);

        if (usuarioMail){
            throw new Error("Este mail ya esta registrado");
        }

        const contraseñaHash = await bcrypt.hash(contraseña, 10);

        const nuevoUsuario = await usuarioDAO.crear({
            nombre,
            apellido,
            username,
            contraseña: contraseñaHash,
            mail,
            descripcion: null,
            fecha_registro: new Date(),
            DVH:null
        });

        return nuevoUsuario;
    }

    async iniciar_sesion(username, contraseña) {
        const usuario = await usuarioDAO.buscarPorUsername(username);

        if (!usuario) {
            throw new Error(
                "Username o contraseña incorrectos"
            );
        }

        const contraseñaCorrecta =
            await bcrypt.compare(
                contraseña,
                usuario.contraseña
            );

        if (!contraseñaCorrecta) {
            throw new Error(
                "Username o contraseña incorrectos"
            );
        }

        const token =
            jwt.sign(
                {
                    id_usuario: usuario.id_usuario,
                    username: usuario.username,
                    rol: usuario.rol
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            );

        return {
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                username: usuario.username,
                mail: usuario.mail,
            }
        };
    }

}

module.exports = new AuthService();
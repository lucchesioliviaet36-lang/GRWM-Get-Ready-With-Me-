const bcrypt = require("bcrypt");
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
            contraseña: contraseñaHash,
            rol: "usuario",
            mail,
            descripcion: null,
            fecha_registro: new Date(),
            DVH:null
        });

        return nuevoUsuario;
    }

}

module.exports = new AuthService();
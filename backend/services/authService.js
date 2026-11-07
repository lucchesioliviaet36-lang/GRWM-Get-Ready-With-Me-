const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const usuarioDAO = require("../dao/usuarioDAO.js");
const Usuario = require("../models/usuarioModels");
const emailService = require("./emailService.js");
const digitoVerificadorService = require("./digitoVerificadorService");
const bitacoraService = require("./bitacoraService");

const MAX_INTENTOS = 5;
const TIEMPO_BLOQUEO_MINUTOS = 30;

// REGISTRAR USUARIO
const registrar = async (datos) => {
    const {
        nombre,
        apellido,
        username,
        contraseña,
        mail
    } = datos;

    if (!nombre || !apellido || !username || !contraseña || !mail) {
        throw new Error(
            "Todos los campos deben completarse"
        );
    }

    const usuarioUsername = await usuarioDAO.buscarPorUsername(username);
    if (usuarioUsername) {
        throw new Error(
            "Este Username ya esta registrado"
        );
    }

    const usuarioMail = await usuarioDAO.buscarPorMail(mail);
    if (usuarioMail) {
        throw new Error(
            "Este mail ya esta registrado"
        );
    }

    const contraseñaHash = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario =
        await usuarioDAO.crear({
            nombre,
            apellido,
            username,
            contraseña: contraseñaHash,
            mail,
            descripcion: null,
            fecha_registro: new Date(),
            DVH: null
        }
    );

    // DVH + DVV
    await digitoVerificadorService.recalcularRegistroYTabla(
        Usuario,
        "Usuario",
        "id_usuario",
        nuevoUsuario.id_usuario
    );

    // BITACORA
    await bitacoraService.registrar({
        idUsuario: nuevoUsuario.id_usuario,
        descripcion: "Registro de usuario",
        accion: "INSERT",
        tablaAfectada: "Usuario",
        usuarioAfectado: nuevoUsuario.id_usuario
    });

    return nuevoUsuario;
};

// INICIAR SESION
const iniciar_sesion = async (identificador, contraseña) => {
    if (!identificador || !contraseña) {
        throw new Error(
            "Debés ingresar el username o mail y la contraseña"
        );
    }

    const usuario = await usuarioDAO.buscarParaInicioSesion(identificador);

    if (!usuario) {
        throw new Error(
            "Usuario, mail o contraseña incorrectos"
        );
    }

    const ahora = new Date();

    // COMPROBAR BLOQUEO
    if (usuario.bloqueado_hasta) {
        const fechaDesbloqueo = new Date(usuario.bloqueado_hasta);

        if (fechaDesbloqueo > ahora) {
            throw new Error(
                "Cuenta temporalmente bloqueada. Intentá nuevamente más tarde."
            );
        }

        await usuarioDAO.reiniciarIntentos(usuario.id_usuario);

        await digitoVerificadorService.recalcularRegistroYTabla(
            Usuario,
            "Usuario",
            "id_usuario",
            usuario.id_usuario
        );

        usuario.intentos_fallidos = 0;
        usuario.bloqueado_hasta = null;
    }

    // COMPARAR CONTRASEÑA
    const contraseñaCorrecta = await bcrypt.compare(contraseña, usuario.contraseña);

    // CONTRASEÑA INCORRECTA
    if (!contraseñaCorrecta) {
        const intentosActuales = Number(usuario.intentos_fallidos || 0) + 1;
        let bloqueadoHasta = null;

        if (intentosActuales >= MAX_INTENTOS) {
            bloqueadoHasta = new Date(
                ahora.getTime() +
                TIEMPO_BLOQUEO_MINUTOS *
                60 *
                1000
            );
        }

        await usuarioDAO.actualizarIntentos(
            usuario.id_usuario,
            intentosActuales,
            bloqueadoHasta
        );

        await digitoVerificadorService.recalcularRegistroYTabla(
            Usuario,
            "Usuario",
            "id_usuario",
            usuario.id_usuario
        );

        if (intentosActuales >= MAX_INTENTOS) {
            throw new Error(
                "Alcanzaste los 5 intentos fallidos. Tu cuenta quedó bloqueada durante 30 minutos."
            );
        }

        throw new Error(
            `Usuario, mail o contraseña incorrectos. Intento ${intentosActuales} de ${MAX_INTENTOS}.`
        );
    }

    // LOGIN CORRECTO
    await usuarioDAO.reiniciarIntentos(usuario.id_usuario);

    await digitoVerificadorService.recalcularRegistroYTabla(
        Usuario,
        "Usuario",
        "id_usuario",
        usuario.id_usuario
    );

    // BITACORA LOGIN
    await bitacoraService.registrar({
        idUsuario: usuario.id_usuario,
        descripcion: "Inicio de sesión exitoso",
        accion: "LOGIN",
        tablaAfectada: "Usuario",
        usuarioAfectado: usuario.id_usuario
    });

    // CREAR JWT
    if (!process.env.JWT_SECRET) {
        throw new Error(
            "Falta configurar JWT_SECRET en el archivo .env"
        );
    }

    const token = jwt.sign(
        {
            id_usuario: usuario.id_usuario,
            username: usuario.username,
            rol: usuario.rol
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d"
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
            rol: usuario.rol
        }
    };
};

// SOLICITAR RECUPERACION
const solicitarRecuperacion = async (mail) => {
    if (!mail) {
        throw new Error(
            "Debés ingresar tu mail"
        );
    }

    const usuario = await usuarioDAO.buscarPorMail(mail.trim());

    if (!usuario) {
        return {
            mensaje:
                "Si existe una cuenta con ese mail, recibirás un enlace para recuperar tu contraseña."
        };
    }

    const token = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const fechaExpiracion = new Date(Date.now() + 15 * 60 * 1000);

    await usuarioDAO.guardarTokenRecuperacion(
        usuario.id_usuario,
        tokenHash,
        fechaExpiracion
    );

    // CAMBIÓ EL USUARIO
    await digitoVerificadorService.recalcularRegistroYTabla(
        Usuario,
        "Usuario",
        "id_usuario",
        usuario.id_usuario
    );

    try {
        await emailService.enviarRecuperacionContrasena(
            usuario.mail,
            token
        );

    } catch (error) {
        console.error(
            "Error enviando mail de recuperación:",
            error
        );

        throw new Error(
            "No se pudo enviar el correo de recuperación"
        );
    }

    await bitacoraService.registrar({
        idUsuario: usuario.id_usuario,
        descripcion: "Recuperación solicitada",
        accion: "PASSWORD_RESET_REQUEST",
        tablaAfectada: "Usuario",
        usuarioAfectado: usuario.id_usuario
    });

    return {
        mensaje:"Si existe una cuenta con ese mail, recibirás un enlace para recuperar tu contraseña."
    };
};

// RESTABLECER CONTRASEÑA
const restablecerContrasena = async (token, nuevaContraseña) => {
    if (!token || !nuevaContraseña) {
        throw new Error(
            "Faltan datos para restablecer la contraseña"
        );
    }

    if (nuevaContraseña.length < 8) {
        throw new Error(
            "La contraseña debe tener al menos 8 caracteres"
        );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const usuario = await usuarioDAO.buscarPorTokenRecuperacion(tokenHash);

    if (!usuario) {
        throw new Error(
            "El enlace es inválido o ya venció"
        );
    }

    const contraseñaHash = await bcrypt.hash(nuevaContraseña, 10);

    await usuarioDAO.actualizarContrasenaRecuperada(
        usuario.id_usuario,
        contraseñaHash
    );

    await digitoVerificadorService.recalcularRegistroYTabla(
        Usuario,
        "Usuario",
        "id_usuario",
        usuario.id_usuario
    );

    await bitacoraService.registrar({
        idUsuario: usuario.id_usuario,
        descripcion: "Contraseña recuperada",
        accion: "PASSWORD_RESET",
        tablaAfectada: "Usuario",
        usuarioAfectado: usuario.id_usuario
    });

    return {
        mensaje:"Contraseña actualizada correctamente"
    };
};

module.exports = {
    registrar,
    iniciar_sesion,
    solicitarRecuperacion,
    restablecerContrasena
};
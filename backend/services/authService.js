const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuarioDAO = require("../dao/usuarioDAO.js");
const crypto = require("crypto");
const emailService = require("./emailService.js");

const MAX_INTENTOS = 5;
const TIEMPO_BLOQUEO_MINUTOS = 30;

const registrar = async (datos) => {
    const {
        nombre,
        apellido,
        username,
        contraseña,
        mail
    } = datos;

    if (!nombre || !apellido || !username || !contraseña || !mail) {
        throw new Error("Todos los campos deben completarse");
    }

    const usuarioUsername = await usuarioDAO.buscarPorUsername(username);

    if (usuarioUsername) {
        throw new Error("Este Username ya esta registrado");
    }

    const usuarioMail = await usuarioDAO.buscarPorMail(mail);

    if (usuarioMail) {
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
        DVH: null
    });

    return nuevoUsuario;
};

const iniciar_sesion = async (identificador, contraseña) => {
    if (!identificador || !contraseña) {
        throw new Error(
            "Debés ingresar el username o mail y la contraseña"
        );
    }

    const usuario = await usuarioDAO.buscarParaInicioSesion(identificador);

    if (!usuario) {
        throw new Error("Usuario, mail o contraseña incorrectos");
    }

    const ahora = new Date();

    // 1. Comprobar si la cuenta está bloqueada.
    if (usuario.bloqueado_hasta) {
        const fechaDesbloqueo = new Date(usuario.bloqueado_hasta);

        if (fechaDesbloqueo > ahora) {
            throw new Error(
                "Cuenta temporalmente bloqueada. Intentá nuevamente más tarde."
            );
        }

        // El bloqueo ya venció: reiniciar los intentos.
        await usuarioDAO.reiniciarIntentos(usuario.id_usuario);

        usuario.intentos_fallidos = 0;
        usuario.bloqueado_hasta = null;
    }

    // 2. Comparar la contraseña con el hash guardado.
    const contraseñaCorrecta = await bcrypt.compare(
        contraseña,
        usuario.contraseña
    );

    // 3. Si es incorrecta, sumar un intento.
    if (!contraseñaCorrecta) {
        const intentosActuales =
            Number(usuario.intentos_fallidos || 0) + 1;

        let bloqueadoHasta = null;

        if (intentosActuales >= MAX_INTENTOS) {
            bloqueadoHasta = new Date(
                ahora.getTime() +
                TIEMPO_BLOQUEO_MINUTOS * 60 * 1000
            );
        }

        await usuarioDAO.actualizarIntentos(
            usuario.id_usuario,
            intentosActuales,
            bloqueadoHasta
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

    // 4. Si la contraseña es correcta, reiniciar el contador.
    await usuarioDAO.reiniciarIntentos(usuario.id_usuario);

    // 5. Crear el JWT.
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

    // 6. Devolver el token y los datos públicos.
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

const solicitarRecuperacion = async (mail) => {
    if (!mail) {
        throw new Error("Debés ingresar tu mail");
    }

    const usuario = await usuarioDAO.buscarPorMail(mail.trim());

    if (!usuario) {
        return {
            mensaje:
                "Si existe una cuenta con ese mail, recibirás un enlace para recuperar tu contraseña."
        };
    }

    const token = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const fechaExpiracion = new Date(Date.now() + 15 * 60 * 1000);

    await usuarioDAO.guardarTokenRecuperacion(
        usuario.id_usuario,
        tokenHash,
        fechaExpiracion
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

        throw new Error("No se pudo enviar el correo de recuperación");
    }

    return {
        mensaje:
            "Si existe una cuenta con ese mail, recibirás un enlace para recuperar tu contraseña."
    };
};

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
        throw new Error("El enlace es inválido o ya venció");
    }

    const contraseñaHash = await bcrypt.hash(nuevaContraseña, 10);

    await usuarioDAO.actualizarContrasenaRecuperada(usuario.id_usuario, contraseñaHash);

    return {
        mensaje: "Contraseña actualizada correctamente"
    };
};

module.exports = {registrar, iniciar_sesion,solicitarRecuperacion, restablecerContrasena};
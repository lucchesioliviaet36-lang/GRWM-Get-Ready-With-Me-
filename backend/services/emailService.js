const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const enviarRecuperacionContrasena = async (mail, token) => {
    const enlace = `${process.env.FRONTEND_URL}/restablecer-contrasena/${token}`;

    await transporter.sendMail({
        from: `GRWM <${process.env.EMAIL_USER}>`,
        to: mail,
        subject: "Recuperar contraseña - GRWM",

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 500px;
                margin: auto;
                padding: 30px;
            ">
                <h2 style="color: #70345c;">Recuperar contraseña</h2>
                <p>Recibimos una solicitud para cambiar la contraseña de tu cuenta de GRWM.</p>
                <p>Hacé clic en el siguiente botón para crear una contraseña nueva:</p>

                <a
                    href="${enlace}"
                    style="
                        display: inline-block;
                        background: #70345c;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 8px;
                        text-decoration: none;
                        margin: 15px 0;
                    "
                > Restablecer contraseña </a>

                <p>Este enlace vence en 15 minutos.</p>
                <p>Si vos no solicitaste este cambio,podés ignorar este correo.</p>
            </div>
        `
    });
};

module.exports = { enviarRecuperacionContrasena};
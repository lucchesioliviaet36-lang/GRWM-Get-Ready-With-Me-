import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./recuperarContrasena.css";

function RecuperarContrasena() {
  const navigate = useNavigate();

  const [mail, setMail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    if (!mail.trim()) {
      setError("Ingresá tu correo electrónico.");
      return;
    }

    try {
      setCargando(true);

      const response = await fetch(
        "http://localhost:3000/api/auth/recuperar-contrasena",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            mail: mail.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje || "No se pudo enviar el correo"
        );
      }

      setMensaje(data.mensaje);

    } catch (error) {
      console.error(error);
      setError(error.message);

    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="recuperar-contrasena">

      <h1>Recuperar contraseña</h1>

      <p>
        Ingresá el correo asociado a tu cuenta.
        Te enviaremos un enlace para crear una
        contraseña nueva.
      </p>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
        />

        {error && (<p className="error">{error}</p>)}

        {mensaje && (<p className="mensaje">{mensaje}</p>)}

        <button
          type="submit"
          disabled={cargando}
        >
          {cargando
            ? "Enviando..."
            : "Enviar enlace"}
        </button>

      </form>

      <button
        type="button"
        onClick={() => navigate("/IniciarSesion ")}
      >
        Volver al inicio de sesión
      </button>

    </div>
  );
}

export default RecuperarContrasena;
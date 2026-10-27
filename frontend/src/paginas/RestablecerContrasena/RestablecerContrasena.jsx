import { useState } from "react";
import { useNavigate, useParams} from "react-router-dom";
import "./restablecerContrasena.css";

function RestablecerContrasena() {
  const navigate = useNavigate();
  const {token} = useParams();

  const [contraseña, setContraseña] = useState("");
  const [repetirContraseña, setRepetirContraseña] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!contraseña || !repetirContraseña) {
      setError("Completá los dos campos.");
      return;
    }

    if (contraseña.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (contraseña !== repetirContraseña) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setCargando(true);

      const response = await fetch(
        `http://localhost:3000/api/auth/restablecer-contrasena/${token}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            nuevaContraseña: contraseña
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensaje || "No se pudo cambiar la contraseña"
        );
      }

      alert("Contraseña actualizada correctamente.");

      navigate("/IniciarSesion");

    } catch (error) {
      console.error(error);
      setError(error.message);

    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="restablecer-contrasena">

      <h1>Nueva contraseña</h1>
      <p>Elegí una contraseña nueva para tu cuenta.</p>

      <form onSubmit={handleSubmit}>

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />

        <input
          type="password"
          placeholder="Repetir contraseña"
          value={repetirContraseña}
          onChange={(e) => setRepetirContraseña(e.target.value)}
        />

        {error && (<p className="error">{error}</p>)}

        <button
          type="submit"
          disabled={cargando}
        >
          {cargando
            ? "Guardando..."
            : "Cambiar contraseña"}
        </button>

      </form>

    </div>
  );
}

export default RestablecerContrasena;
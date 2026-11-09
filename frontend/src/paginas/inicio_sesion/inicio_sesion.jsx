import { useNavigate } from 'react-router-dom'
import { useState } from "react";
import "./inicio_sesion.css";
import Footer from "../../componentes/footer/footer";

function InicioSesion() {
  const navigate = useNavigate();
  const [identificador, setIdentificador] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (identificador.trim() === "" || password.trim() === "") {
      setError("Complete todos los campos");
      return;
    }

    try {
      const respuesta = await fetch(
        "http://localhost:3000/api/auth/IniciarSesion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            identificador: identificador.trim(),
            contraseña: password
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.mensaje || "Usuario, email o contraseña incorrectos");
        return;
      }

      // Guardamos el token que genera el backend
      localStorage.setItem("token", datos.token);

      // Guardamos datos básicos del usuario
      localStorage.setItem("token", datos.token);
      localStorage.setItem("usuario", JSON.stringify(datos.usuario));

      if (datos.usuario.rol === "administrador") {
        navigate("/administrador");
      } else {
        navigate("/paginaPrincipal");
      }

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("No se pudo conectar con el servidor");
    }
  };

  const irARegistro = () => {
    navigate("/");
  };

  return (
    <div className="InicioSesion-Page">

      <header className="barra-superior-registro">
        <div className="logo-registro">
          ✧ <span>GRWM</span>
        </div>
        <button
          type="button"
          className="btn-ayuda"
          onClick={() => {
              alert("Contacta al equipo de GRWM: flores.miaet36@gmail.com");
              setMenuAbierto(false);
            }}
          >
            ✉ Ayuda y Soporte
        </button>
      </header>

      <main className="sesion-contenido-principal">
        <div className="InicioSesion-Container">

          <div className="InicioSesion-Header">
            <h1>Iniciar Sesión en GRWM</h1>
            <p>Ingresa a tu cuenta para compartir tus outfits y descubrir nuevas tendencias.</p>
          </div>

          <form onSubmit={handleSubmit} className="InicioSesion-Formulario">

            <div className="form-group-sesion">
              <label htmlFor="identificador">Usuario o email</label>

              <div className="input-with-icon">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>

                <input
                  id="identificador"
                  type="text"
                  placeholder="Ingresa tu nombre de usuario o email"
                  value={identificador}
                  onChange={(e) => setIdentificador(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group-sesion">
              <label htmlFor="password">Contraseña</label>

              <div className="input-with-icon">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="btn-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="Olvidar-Password">
              <button type="button" onClick={() => navigate("/recuperar-contrasena")}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {error && (
              <div className="Error-IniciarS">
                {error}
              </div>
            )}

            <button type="submit" className="InicioSesion-Boton">
              Iniciar Sesión
            </button>

          </form>

          <div className="Opcion-Registro-Link">
            <span>¿No tienes una cuenta?</span>

            <button type="button" className="ir-a-registro" onClick={irARegistro}>
              Registrarse
            </button>
          </div>

        </div>
      </main>

      <Footer/>

    </div>
  );
}

export default InicioSesion;
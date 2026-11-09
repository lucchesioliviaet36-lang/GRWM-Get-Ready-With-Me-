import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./registro.css";
import Footer from "../../componentes/footer/footer";

function Registro() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepetirPassword, setShowRepetirPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      nombre.trim() === "" ||
      apellido.trim() === "" ||
      usuario.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      repetirPassword.trim() === ""
    ) 
    {
      setError("Complete todos los campos");
      return;
    }

    if (password !== repetirPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const respuesta = await fetch(
        "http://localhost:3000/api/auth/registrar",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            username: usuario.trim(),
            contraseña: password,
            mail: email.trim()
          })
        }
      );

      const datos = await respuesta.json();
      console.log(datos);

      if (!respuesta.ok) {
        setError(datos.mensaje || "Error al registrar el usuario");
        return;
      }


      const usuarioCreado = datos.usuario;

      console.log("Usuario creado:", usuarioCreado);
      console.log("¿El registro devuelve token?:", !!datos.token);

      
      // Guardar los datos de la cuenta recién creada
      localStorage.setItem("usuario", JSON.stringify(usuarioCreado));

      if (datos.token) {
        localStorage.setItem("token", datos.token);
      }

      alert("¡Registro realizado correctamente!");

      navigate("/editar_perfil");

    } 
    catch (error) {
      console.error("Error al conectar con el backend:", error);

      setError(
        "No se pudo conectar con el servidor. Intente nuevamente."
      );
    }
  };

  const volverInicioSesion = () => {
    navigate("/IniciarSesion");
  };

  return (
    <div className="Registro-Page">
      
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

      <main className="registro-contenido-principal">
        <div className="Registro-Container">
          
          <div className="Registro-Header">
            <h1>Crea tu cuenta en GRWM</h1>
            <p>Únete a la comunidad de moda más grande para inspirarte y vender tu estilo.</p>
          </div>

          <form onSubmit={handleSubmit} className="Registro-Formulario">
            
            <div className="form-group-registro">
              <label htmlFor="usuario">Nombre de Usuario</label>
              <div className="input-with-icon">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                  </svg>
                </span>
                <input
                  id="usuario"
                  type="text"
                  placeholder="@usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group-registro">
              <label htmlFor="nombre">Nombre</label>

              <div className="input-with-icon">
                <input
                  id="nombre"
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group-registro">
              <label htmlFor="apellido">Apellido</label>

              <div className="input-with-icon">
                <input
                  id="apellido"
                  type="text"
                  placeholder="Apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group-registro">
              <label htmlFor="email">Correo Electrónico</label>
              <div className="input-with-icon">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group-registro">
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
                  placeholder="••••••••"
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

            <div className="form-group-registro">
              <label htmlFor="repetirPassword">Confirmar Contraseña</label>
              <div className="input-with-icon">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="repetirPassword"
                  type={showRepetirPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={repetirPassword}
                  onChange={(e) => setRepetirPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-password-toggle"
                  onClick={() => setShowRepetirPassword(!showRepetirPassword)}
                >
                  {showRepetirPassword ? (
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

            {error && <div className="Error-Registro">{error}</div>}

            <button type="submit" className="Registro-Boton">
              Crear Cuenta
            </button>
          </form>

          <div className="Opcion-InicioSesion">
            <span>¿Ya tienes una cuenta?</span>
            <button type="button" className="volver-login" onClick={volverInicioSesion}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      </main>

      <Footer/>
      
    </div>
  );
}

export default Registro;
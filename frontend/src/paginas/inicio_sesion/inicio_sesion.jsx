import { useNavigate } from 'react-router-dom'
import { useState } from "react";
import "./inicio_sesion.css";

function InicioSesion() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (usuario.trim() === "" || password.trim() === ""){
        setError("Complete todos los campos");
        return;
    }

    console.log("Usuario: ", usuario);
    console.log("Password: ", password);

    alert("¡Inicio de sesión correcto!");
    navigate("/perfil_propio"); 
  };

  const irARegistro = () => {
    navigate("/registro");
  };

  return (
    <div className="InicioSesion-Page">
      
      {/* BARRA SUPERIOR DE INICIO DE SESIÓN */}
      <header className="barra-superior-sesion">
        <div className="logo-sesion">
          ✧ <span>GRWM</span>
        </div>
        <nav className="menu-sesion">
          <button onClick={() => navigate('/tienda')}>Tienda</button>
          <button onClick={() => navigate('/soporte')}>Soporte</button>
        </nav>
      </header>

      <main className="sesion-contenido-principal">
        <div className="InicioSesion-Container">

          <div className="InicioSesion-Header">
            <h1>Iniciar Sesión en GRWM</h1>
            <p>Ingresa a tu cuenta para compartir tus outfits y descubrir nuevas tendencias.</p>
          </div>

          <form onSubmit={handleSubmit} className="InicioSesion-Formulario">

            {/* CAMPO USUARIO O EMAIL */}
            <div className="form-group-sesion">
              <label htmlFor="usuario">Usuario o email</label>
              <div className="input-with-icon">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input 
                  id="Usuario"
                  type="text"
                  placeholder="Ingresa tu nombre de usuario o email"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </div>
            </div>

            {/* CAMPO PASSWORD */}
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

            {/* RECUPERACIÓN DE CONTRASEÑA */}
            <div className="Olvidar-Password">
              <button type="button" onClick={() => alert("Simulación de recuperación enviada a tu correo.")}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {error && (
              <div className="Error-IniciarS">
                {error}
              </div>
            )}

            {/* BOTÓN INICIAR SESIÓN */}
            <button type="submit" className="InicioSesion-Boton">
              Iniciar Sesión
            </button>

          </form>

          {/* SECCIÓN REDES SOCIALES DIVISOR */}
          <div className="social-divider">
            <span>o ingresa con</span>
          </div>

          {/* BOTONES SOCIALES */}
          <div className="social-buttons">
            <button className="btn-social google" onClick={() => alert("Inicio con Google simulado")}>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>
            <button className="btn-social apple" onClick={() => alert("Inicio con Apple simulado")}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.23.67-2.95 1.51-.63.73-1.19 1.87-1.04 2.98 1.12.09 2.27-.58 3-1.43z"/>
              </svg>
              <span>Apple</span>
            </button>
          </div>

          {/* ACCESO A REGISTRO */}
          <div className="Opcion-Registro-Link">
            <span>¿No tienes una cuenta?</span>
            <button type="button" className="ir-a-registro" onClick={irARegistro}>
              Registrarse
            </button>
          </div>

        </div>
      </main>

      {/* FOOTER GENERAL */}
      <footer className="footer-sesion">
        <div className="footer-derechos">
          © 2025 GRWM. Todos los derechos reservados.
        </div>
        <div className="footer-links">
          <button onClick={() => alert("Privacidad")}>Privacidad</button>
          <button onClick={() => alert("Términos de servicio")}>Términos de servicio</button>
        </div>
      </footer>

    </div>
  );
}

export default InicioSesion;
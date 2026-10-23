import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";

const API_URL = "http://localhost:3000";

function Header() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const token = localStorage.getItem("token");
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario")) || {};

  // OBTENER USUARIO LOGUEADO
  const obtenerUsuario = async () => {
    try {
      if (!token) {
        return;
      }

      if (!usuarioGuardado.id_usuario) {
        setUsuario(usuarioGuardado);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/usuarios/${usuarioGuardado.id_usuario}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudo obtener el usuario");
      }

      const usuarioActual = data.usuario || data;

      setUsuario(usuarioActual);

      localStorage.setItem(
        "usuario",
        JSON.stringify(usuarioActual)
      );

    } catch (error) {
      console.error("Error obteniendo usuario:", error);

      setUsuario(usuarioGuardado);
    }
  };

  useEffect(() => {
    obtenerUsuario();
  }, []);

  // DATOS PARA MOSTRAR EN EL HEADER
  const nombreMostrarHeader = usuario
    ? `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim()
    : `${usuarioGuardado.nombre || ""} ${usuarioGuardado.apellido || ""}`.trim();

  const usuarioTagHeader = usuario?.username
    ? `@${usuario.username}`
    : usuarioGuardado.username
      ? `@${usuarioGuardado.username}`
      : "";

  const obtenerFotoPerfil = () => {
    const foto = usuario?.foto_perfil || usuarioGuardado.foto_perfil;

    if (!foto) {
      return null;
    }

    if (foto.startsWith("http")) {
      return foto;
    }

    return `${API_URL}${foto}`;
  };

  const fotoPerfilHeader = obtenerFotoPerfil();

  // CERRAR SESIÓN
  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("grwm_publicaciones");
    localStorage.removeItem("grwm_banner");
    localStorage.removeItem("grwm_foto_perfil");
    localStorage.removeItem("grwm_user_profile");
    localStorage.removeItem("grwm_favoritos");

    setMenuAbierto(false);
    navigate("/IniciarSesion");
  };

  // ELIMINAR CUENTA
  const handleEliminarCuenta = async () => {
    const idUsuarioActual = usuario?.id_usuario || usuarioGuardado.id_usuario;

    if (!idUsuarioActual) {
      alert("No se encontró la sesión del usuario. Por favor volvé a iniciar sesión.");
      return;
    }

    const confirmar = window.confirm(
      "¿Estás seguro de que querés eliminar tu cuenta? Esta acción borrará tus publicaciones y datos permanentemente."
    );

    if (!confirmar) return;

    try {
      const response = await fetch(
        `${API_URL}/api/usuarios/${idUsuarioActual}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "No se pudo eliminar la cuenta"
        );
      }

      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      localStorage.removeItem("grwm_publicaciones");
      localStorage.removeItem("grwm_banner");
      localStorage.removeItem("grwm_foto_perfil");
      localStorage.removeItem("grwm_user_profile");
      localStorage.removeItem("grwm_favoritos");

      alert("Tu cuenta fue eliminada correctamente.");
      navigate("/");

    } catch (error) {
      console.error("Error eliminando cuenta:", error);
      alert(error.message || "Error de conexión con el servidor.");
    }
  };

  return (
    <header className="barra-superior">

      <div
        className="logo"
        onClick={() => navigate("/paginaPrincipal")}
      >
        ✧ <span>GRWM</span>
      </div>

      <button
        className="boton-busqueda"
        type="button"
        onClick={() => navigate("/busqueda")}
      >
        🔍︎
      </button>

      <nav className="menu">

        <button onClick={() => navigate("/miArmario")}>
          Mi Armario
        </button>

        <button onClick={() => navigate("/perfil_propio")}>
          Mi Perfil
        </button>

        <button onClick={() => navigate("/tienda_principal")}>
          Tienda
        </button>

        <button onClick={() => navigate("/paginaPrincipal")}>
          Página Principal
        </button>

        <div className="mini-avatar-contenedor">

          <div
            className={`mini-avatar ${menuAbierto ? "activo" : ""}`}
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            {fotoPerfilHeader && (
              <img
                src={fotoPerfilHeader}
                alt="Foto de perfil"
              />
            )}
          </div>

          {menuAbierto && (
            <div className="menu-desplegable-perfil">

              <div className="menu-usuario-detalles">

                {fotoPerfilHeader && (
                  <img
                    src={fotoPerfilHeader}
                    alt="Foto de perfil"
                    className="foto-perfil-menu"
                  />
                )}

                <div className="datos-usuario-header">

                  {nombreMostrarHeader && (
                    <strong>{nombreMostrarHeader}</strong>
                  )}

                  {usuarioTagHeader && (
                    <span>{usuarioTagHeader}</span>
                  )}

                </div>

              </div>

              <div className="menu-divisor"></div>

              <button
                type="button"
                onClick={() => {
                  navigate("/perfil_propio");
                  setMenuAbierto(false);
                }}
              >
                Mi Perfil
              </button>

              <button
                type="button"
                onClick={() => {
                  alert("Contacta al equipo de GRWM: soporteGRWM@gmail.com");
                  setMenuAbierto(false);
                }}
              >
                ✉ Ayuda y Soporte
              </button>

              <div className="menu-divisor"></div>

              <button
                className="menu-btn-logout"
                onClick={handleCerrarSesion}
              >
                Cerrar Sesión
              </button>

              <button
                type="button"
                className="menu-btn-eliminar"
                onClick={handleEliminarCuenta}
              >
                Eliminar cuenta
              </button>

            </div>
          )}

        </div>

      </nav>

    </header>
  );
}

export default Header;
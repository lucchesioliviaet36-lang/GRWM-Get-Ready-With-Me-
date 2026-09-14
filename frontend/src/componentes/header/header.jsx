import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./header.css";
import fotoPerfilPropio from "../../assets/imagenes/fotoDePerfilPropio.jpg";

function Header() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // FUNCIÓN ELIMINAR CUENTA
  const handleEliminarCuenta = async () => {
    // 1. Leemos el token y el usuario con las claves exactas de inicio_sesion.jsx
    const token = localStorage.getItem("token");
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
    const idUsuarioActual = usuarioGuardado?.id_usuario;

    if (!idUsuarioActual) {
      alert("No se encontró la sesión del usuario. Por favor volvé a iniciar sesión.");
      return;
    }

    const confirmar = window.confirm(
      "¿Estás seguro de que querés eliminar tu cuenta? Esta acción borrará tus publicaciones y datos permanentemente."
    );

    if (!confirmar) return;

    try {
      // 2. Preparamos el encabezado de autorización con el token real
      const headers = {
        "Content-Type": "application/json"
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 3. Enviamos la orden de eliminar a la API
      const response = await fetch(`http://localhost:3000/api/usuarios/${idUsuarioActual}`, {
        method: "DELETE",
        headers: headers
      });

      if (response.ok) {
        // Limpiamos los datos del navegador
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        localStorage.removeItem("grwm_publicaciones");

        alert("Tu cuenta fue eliminada correctamente.");
        navigate("/");
      } else {
        alert("Ocurrió un error al intentar eliminar la cuenta en la base de datos.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <header className="barra-superior">
      <div className="logo" onClick={() => navigate('/paginaPrincipal')}>
        ✧ <span>GRWM</span>
      </div>

      <button 
        className="boton-busqueda" 
        type="button" 
        onClick={() => navigate('/busqueda')}
      >
        🔍︎
      </button>

      <nav className="menu">
        <button onClick={() => navigate('/miArmario')}>Mi Armario</button>
        <button onClick={() => navigate('/perfil_propio')}>Mi Perfil</button>
        <button className="menu-item-activo" onClick={() => navigate('/tienda_principal')}>Tienda</button>
        <button onClick={() => navigate('/paginaPrincipal')}>Página Principal</button>
        
        <div className="mini-avatar-contenedor">
          <div 
            className={`mini-avatar ${menuAbierto ? 'activo' : ''}`} 
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <img src={fotoPerfilPropio} alt="Foto de perfil" />
          </div>

          {menuAbierto && (
            <div className="menu-desplegable-perfil">
              <div className="menu-usuario-detalles">
                <strong>Taylor Swift</strong>
                <span>@taylor_swift13</span>
              </div>
              <div className="menu-divisor"></div>
              
              <button onClick={() => { 
                alert("Contacta al equipo de GRWM: soporteGRWM@gmail.com"); 
                setMenuAbierto(false); 
              }}>
                ✉ Ayuda y Soporte
              </button>
              
              <div className="menu-divisor"></div>
              
              <button className="menu-btn-logout" onClick={() => navigate('/')}>
                 Cerrar Sesión
              </button>

              <button 
                type="button" 
                onClick={handleEliminarCuenta}
                style={{ color: '#d93838', fontWeight: 'bold', cursor: 'pointer' }}
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
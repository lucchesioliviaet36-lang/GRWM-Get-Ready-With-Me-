import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./header.css";

function Header() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // 👤 Datos dinámicos del usuario logueado desde localStorage
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario")) || {};

  const nombreMostrarHeader = usuarioGuardado.nombre 
    ? `${usuarioGuardado.nombre} ${usuarioGuardado.apellido || ''}`.trim() 
    : (usuarioGuardado.username || 'Mi Usuario');
    
  const usuarioTagHeader = usuarioGuardado.username ? `@${usuarioGuardado.username}` : '@usuario';
  const fotoPerfilHeader = usuarioGuardado.foto_perfil || localStorage.getItem('grwm_foto_perfil') || null;

  // FUNCIÓN ELIMINAR CUENTA
  const handleEliminarCuenta = async () => {
    const token = localStorage.getItem("token");
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
      const headers = {
        "Content-Type": "application/json"
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:3000/api/usuarios/${idUsuarioActual}`, {
        method: "DELETE",
        headers: headers
      });

      if (response.ok) {
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
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              backgroundColor: '#f3e8ee',
              borderRadius: '50%',
              overflow: 'hidden'
            }}
          >
            {fotoPerfilHeader ? (
              <img src={fotoPerfilHeader} alt="Foto de perfil" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5274" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </div>

          {menuAbierto && (
            <div className="menu-desplegable-perfil">
              <div className="menu-usuario-detalles">
                <strong>{nombreMostrarHeader}</strong>
                <span>{usuarioTagHeader}</span>
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
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./header.css"
import fotoPerfilPropio from "../../assets/imagenes/fotoDePerfilPropio.jpg";

function Header() {
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    
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
          <button className="menu-item-activo" onClick={() => navigate('/miTienda')}>Tienda </button>
          <button onClick={() => navigate('/paginaPrincipal')}>Página Principal</button>
          
          <div className="mini-avatar-contenedor">
            <div 
              className={`mini-avatar ${menuAbierto ? 'activo' : ''}`} 
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              <img src={fotoPerfilPropio} alt="Foto de perfil" /></div>

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

                <button className="menu-btn-logout" onClick={() => navigate('/registro')}>
                   Eliminar Cuenta
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>
    );
}
export default Header;
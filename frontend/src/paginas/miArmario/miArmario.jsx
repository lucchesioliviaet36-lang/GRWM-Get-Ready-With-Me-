import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./miArmario.css";
import fotoPerfilPropio from '../../assets/imagenes/fotoDePerfilPropio.jpg'

function MiArmario() {
  const navigate = useNavigate();
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Estado para el menú desplegable del header interactivo
  const [menuAbierto, setMenuAbierto] = useState(false); // Placeholder para el avatar

  const obtenerPrendas = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/prendas", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo cargar tu armario");
      setPrendas(data.prendas);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarPrenda = async (idPrenda) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/prendas/${idPrenda}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo eliminar la prenda");
      setPrendas((prendasActuales) => prendasActuales.filter((prenda) => prenda.id_prenda !== idPrenda));
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  useEffect(() => { obtenerPrendas(); }, []);

  return (
    <div className="Armario-Page">
      {/* BARRA SUPERIOR ACTUALIZADA */}
      <header className="barra-superior">
        <div className="logo" onClick={() => navigate('/perfil_propio')}>
          ✧ <span>GRWM</span>
        </div>

        <button className="boton-busqueda" type="button" onClick={() => navigate('/busqueda')}>
          🔍︎
        </button>

        <nav className="menu">
          {/* Botón seleccionado en negrita según tu pedido */}
          <button className="menu-item-activo" onClick={() => navigate('/miArmario')}>
            Mi Armario
          </button>
          <button onClick={() => navigate('/perfil_propio')}>Mi Perfil</button>
          <button onClick={() => navigate('/tienda_principal')}>Tienda</button>
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
                <button onClick={() => { alert("soporteGRWM@gmail.com"); setMenuAbierto(false); }}>
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="armario-contenido">
        <section className="armario-presentacion">
          <div>
            <span className="armario-subtitulo">TU ESPACIO</span>
            <h1>Mi Armario</h1>
            <p>Organizá tus prendas favoritas y dejá que GRWM las use para crear outfits pensados para vos.</p>
          </div>
          <button className="boton-agregar-prenda" onClick={() => navigate("/agregar_prenda")}>
            + Agregar prenda
          </button>
        </section>

        {error && <div className="armario-error">{error}</div>}

        {loading ? (
          <div className="armario-cargando">
            <div className="loader-armario"></div>
            <p>Cargando tu armario...</p>
          </div>
        ):
         prendas.length === 0 ? (
          <section className="armario-vacio">
            <div className="armario-vacio-icono">♡</div>
            <h2>Tu armario está esperando</h2>
            <p>Todavía no agregaste ninguna prenda. Podés comenzar cargando una prenda tuya o explorar inspiración.</p>
            <div className="armario-vacio-botones">
              <button className="boton-principal-armario" onClick={() => navigate("/agregar_prenda")}>
                + Agregar mi primera prenda
              </button>
              <button className="boton-secundario-armario" onClick={() => navigate("/explorar-prendas")}>
                ✧ Explorar inspiración
              </button>
            </div>
          </section>
        ): 
        (
          <section>
            <div className="armario-listado-header">
              <div>
                <h2>Mis prendas</h2>
                <p>{prendas.length} {prendas.length === 1 ? "prenda guardada" : "prendas guardadas"}</p>
              </div>
              <button className="boton-explorar" onClick={() => navigate("/explorar-prendas")}>
                ✧ Explorar prendas
              </button>
            </div>
            <div className="prendas-grid">
              {prendas.map((prenda) => (
                <article className="prenda-card" key={prenda.id_prenda}>
                  <div className="prenda-imagen">
                    {prenda.imagen_url ? <img src={prenda.imagen_url} alt={prenda.nombre} /> : <div className="prenda-sin-imagen">♡</div>}
                  </div>
                  <div className="prenda-contenido">
                    <span className="prenda-categoria">{prenda.categoria}</span>
                    <h3>{prenda.nombre}</h3>
                    {prenda.color && <p>{prenda.color}</p>}
                    {prenda.descripcion && <p className="prenda-descripcion">{prenda.descripcion}</p>}
                    {prenda.origen === "catalogo_externo" && <span className="prenda-origen">✧ Inspirada en catálogo</span>}
                  </div>
                  <div className="prenda-acciones">
                    <button className="boton-eliminar-prenda" onClick={() => eliminarPrenda(prenda.id_prenda)}>Eliminar</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer-armario">
        <div>© 2026 GRWM. Todos los derechos reservados.</div>
        <div className="footer-armario-links">
          <button>Privacidad</button>
          <button>Términos de servicio</button>
        </div>
      </footer>
    </div>
  );
}

export default MiArmario;

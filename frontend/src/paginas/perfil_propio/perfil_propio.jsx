import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bannerFotoDePerfilPropio from '../../assets/imagenes/bannerFotoDePerfilPropio.jpg'
import fotoPerfilPropio from '../../assets/imagenes/fotoDePerfilPropio.jpg'
import fotoPropia1 from '../../assets/imagenes/fotoPropia1.jpg'
import fotoPropia2 from '../../assets/imagenes/fotoPropia2.jpg'
import fotoPropia3 from '../../assets/imagenes/fotoPropia3.jpg'
import fotoPropia4 from '../../assets/imagenes/fotoPropia4.jpg'

// Tus prendas reales del Closet
import closetPropio1 from '../../assets/imagenes/closetPropio1.jpg' // Cardigan Folklore
import closetPropio2 from '../../assets/imagenes/closetPropio2.jpg' // Cardigan Midnight

import './perfil_propio.css'

function PerfilPropio() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [pestanaActiva, setPestanaActiva] = useState('publicaciones');

  // LISTA 1: Tus posts sociales (Outfits completos)
  const publicaciones = [
    { id: 1, ruta: '/publicacion1', img: fotoPropia1, likes: 189, esFavorito: false },
    { id: 2, ruta: '/publicacion2', img: fotoPropia2, likes: 245, esFavorito: false },
    { id: 3, ruta: '/publicacion3', img: fotoPropia3, likes: 98, esFavorito: false },
    { id: 4, ruta: '/publicacion4', img: fotoPropia4, likes: 150, esFavorito: false }
  ];

  // LISTA 2: Tu armario personal (Prendas solas)
  const prendasCloset = [
    { id: 1, img: closetPropio1, nombre: 'Folklore Cardigan', categoria: 'Cardigans' },
    { id: 2, img: closetPropio2, nombre: 'Midnight Cardigan', categoria: 'Cardigans' }
  ];

  const irARuta = (ruta) => {
    setMenuAbierto(false);
    navigate(ruta);
  };

  // Filtrar los favoritos de tus publicaciones sociales
  const publicacionesFavoritas = publicaciones.filter(post => post.esFavorito);

  return (
    <div className="pagina-perfil">
      
      {/* BARRA SUPERIOR */}
      <header className="barra-superior">
        <div className="logo-contenedor">
          <button className="logo" type="button" onClick={() => setMenuAbierto(!menuAbierto)}>
            ✧ <span>GRWM</span>
          </button>

          {menuAbierto && (
            <div className="menu-logo">
              <button onClick={() => setMenuAbierto(false)}>Mi perfil</button>
              <button onClick={() => irARuta('/tienda')}>Tienda</button>
              <button onClick={() => irARuta('/')}>Página Principal</button>
              <button onClick={() => irARuta('/configuracion')}>Configuración</button>
            </div>
          )}
        </div>
        
        <div className="buscador">
          <span className="icono-busqueda">🔍︎</span>
          <input type="text" placeholder="Buscar outfits, marcas, tendencias..." />
        </div>

        <nav className="menu">
          <button onClick={() => navigate('/comunidad')}>Comunidad</button>
          <button onClick={() => navigate('/tienda')}>Tienda</button>
          <button onClick={() => navigate('/soporte')}>Soporte</button>
          <div className="mini-avatar">
            <img src={fotoPerfilPropio} alt="Foto de perfil" />
          </div>
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="contenido">

        {/* PORTADA + PERFIL */}
        <section className="tarjeta-perfil">
          <div className="portada" style={{ backgroundImage: `url(${bannerFotoDePerfilPropio})` }}></div>
          <div className="datos-perfil">
            <div className="avatar">
              <img src={fotoPerfilPropio} alt="Avatar de Taylor Swift" />
            </div>
            <div className="nombre-y-descripcion">
              <h1>Taylor Swift</h1>
              <p className="usuario">@taylor_swift13</p>
              <p className="descripcion">
                Cantante, compositora y amante de la moda -`𖹭´- <br />
                Compartiendo looks de cada era ♬⋆.˚
              </p>
            </div>
            <div className="estadisticas">
              <div>
                <strong>{publicaciones.length}</strong>
                <span>Publicaciones</span>
              </div>
              <div>
                <strong>1.8k</strong>
                <span>Seguidores</span>
              </div>
              <div>
                <strong>352</strong>
                <span>Siguiendo</span>
              </div>
              <div className="botones">
                <button className="btn-editar">Editar Perfil</button>
                <button className="btn-tienda" onClick={() => navigate('/tienda')}>Mi Tienda</button>
              </div>
            </div>
          </div>
        </section>

        {/* PESTAÑAS INTERACTIVAS */}
        <div className="pestanas">
          <button className={pestanaActiva === 'publicaciones' ? 'activa' : ''} onClick={() => setPestanaActiva('publicaciones')}>
            Publicaciones
          </button>
          <button className={pestanaActiva === 'closet' ? 'activa' : ''} onClick={() => setPestanaActiva('closet')}>
            Mi Closet
          </button>
          <button className={pestanaActiva === 'favoritos' ? 'activa' : ''} onClick={() => setPestanaActiva('favoritos')}>
            Favoritos
          </button>
        </div>

        {/* GRID DE CONTENIDO SEGÚN LA PESTAÑA */}
        <section className="grid-publicaciones">
          
          {/* VISTA 1: PUBLICACIONES SOCIALES (OUTOFITS) */}
          {pestanaActiva === 'publicaciones' && publicaciones.map((post) => (
            <button key={post.id} className="post" type="button" onClick={() => navigate(post.ruta)}>
              <div className="foto-post">
                <img src={post.img} alt={`Publicación ${post.id}`} />
              </div>
              <div className="pie-post">
                <span>♡ {post.likes}</span>
              </div>
            </button>
          ))}

          {/* VISTA 2: CLOSET VIRTUAL (PRENDAS SOLAS SIN REDIRECCIÓN) */}
          {pestanaActiva === 'closet' && prendasCloset.map((prenda) => (
            <div key={prenda.id} className="post" style={{ cursor: 'default' }}>
              <div className="foto-post">
                <img src={prenda.img} alt={prenda.nombre} />
              </div>
              <div className="pie-post">
                <span>{prenda.categoria}</span>
                <strong className="tag-prenda">{prenda.nombre}</strong>
              </div>
            </div>
          ))}

          {/* MENSAJES PARA SECCIONES VACÍAS */}
          {pestanaActiva === 'favoritos' && publicacionesFavoritas.length === 0 && (
            <p className="sin-contenido">No tenés publicaciones guardadas en favoritos todavía.</p>
          )}

          {pestanaActiva === 'closet' && prendasCloset.length === 0 && (
            <p className="sin-contenido">No hay prendas agregadas a tu closet aún.</p>
          )}
        </section>

      </main>
    </div>
  );
}

export default PerfilPropio;
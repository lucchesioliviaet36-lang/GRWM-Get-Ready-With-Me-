import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import fotoPerfilPropio from '../../assets/imagenes/fotoDePerfilPropio.jpg'
import fotoPropia4 from '../../assets/imagenes/fotoPropia4.jpg'
import '../publicacion1/publicacion1.css'

function Publicacion4() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [comentarios, setComentarios] = useState([
    { usuario: '@fearless_era', texto: '¡DIOSA! Ese brillo no se puede creer ✨🎤' },
    { usuario: '@reputation_st', texto: '¡El mejor look de todo el show lejos!' }
  ]);

  const handleAgregarComentario = (e) => {
    e.preventDefault();
    if (nuevoComentario.trim() === '') return;
    setComentarios([...comentarios, { usuario: '@taylor_swift13', texto: nuevoComentario.trim() }]);
    setNuevoComentario('');
  };

  return (
    <div className="pagina-publicacion">
      {/* BARRA SUPERIOR */}
      <header className="barra-superior-publicacion">
        <button className="logo-publicacion" type="button" onClick={() => navigate('/perfil_propio')}>
          ✧ <span>GRWM</span>
        </button>
        <div className="buscador-publicacion">
          <span>⌕</span>
          <input type="text" placeholder="Buscar outfits, marcas, tendencias..." />
        </div>
        <nav className="menu-publicacion">
          <button onClick={() => navigate('/comunidad')}>Comunidad</button>
          <button onClick={() => navigate('/tienda')}>Tienda</button>
          <button onClick={() => navigate('/soporte')}>Soporte</button>
          <div className="mini-avatar-publicacion" onClick={() => navigate('/perfil_propio')} style={{ cursor: 'pointer' }}>
            <img src={fotoPerfilPropio} alt="Foto de perfil" />
          </div>
        </nav>
      </header>

      {/* CONTENIDO */}
      <main className="contenido-publicacion">
        <button className="volver" type="button" onClick={() => navigate('/perfil_propio')}>
          ← Volver a mi perfil
        </button>

        <section className="publicacion-card">
          <div className="publicacion-foto">
            <img src={fotoPropia4} alt="Look de Show Taylor" />
          </div>

          <div className="publicacion-info">
            <div className="usuario-publicacion">
              <div className="avatar-publicacion" onClick={() => navigate('/perfil_propio')} style={{ cursor: 'pointer' }}>
                <img src={fotoPerfilPropio} alt="Foto de perfil" />
              </div>
              <div>
                <strong>Taylor Swift</strong>
                <span>@taylor_swift13</span>
              </div>
            </div>

            <div className="descripcion-publicacion">
              <p className="descripcion-texto">
                Un vestido con el que soñé toda la vida para salir al escenario. ¿Qué les parece cómo refleja las luces del show? 🌟✨🎤
              </p>
              <span className="fecha">Hace 1 semana</span>
            </div>

            <div className="interacciones">
              <div className="iconos-interaccion">
                <button type="button" className={liked ? 'activo-like' : ''} onClick={() => setLiked(!liked)}>
                  {liked ? '♥' : '♡'}
                </button>
                <button type="button" className={saved ? 'activo-save' : ''} onClick={() => setSaved(!saved)}>
                  {saved ? '★' : '☆'}
                </button>
                <button type="button" onClick={() => alert('¡Enlace copiado!')}>↗</button>
              </div>
              <strong className="cantidad-likes">
                {liked ? 151 : 150} Me gusta
              </strong>
            </div>

            {/* No renderizamos la sección de precio porque este outfit no está a la venta */}

            <div className="comentarios-contenedor">
              <div className="comentarios">
                {comentarios.map((com, index) => (
                  <div className="comentario" key={index}>
                    <strong>{com.usuario}</strong>
                    <span>{com.texto}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="agregar-comentario" onSubmit={handleAgregarComentario}>
              <input
                type="text"
                placeholder="Añade un comentario..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
              />
              <button type="submit">Publicar</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Publicacion4;
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import fotoPerfilPropio from '../../assets/imagenes/fotoDePerfilPropio.jpg'
import fotoPropia1 from '../../assets/imagenes/fotoPropia1.jpg' // Volvemos a la foto modelada
import './publicacion1.css'

function Publicacion1() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [comentarios, setComentarios] = useState([
    { usuario: '@fashionlover', texto: 'Me encanta este look ♡' },
    { usuario: '@swiftie13', texto: 'Los colores quedan preciosos!!!' }
  ]);
  const [nuevoComentario, setNuevoComentario] = useState('');

  const handleAgregarComentario = (e) => {
    e.preventDefault();
    if (nuevoComentario.trim() === '') return;
    setComentarios([...comentarios, { usuario: '@taylor_swift13', texto: nuevoComentario.trim() }]);
    setNuevoComentario('');
  };

  return (
    <div className="pagina-publicacion">
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

      <main className="contenido-publicacion">
        <button className="volver" type="button" onClick={() => navigate('/perfil_propio')}>
          ← Volver a mi perfil
        </button>

        <section className="publicacion-card">
          <div className="publicacion-foto">
            <img src={fotoPropia1} alt="Look de Taylor Swift" />
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
                Un look casual pero con un toque, perfecto para salir y sentirte increíble. ✨
              </p>
              <span className="fecha">Hace 2 días</span>
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
                {liked ? 190 : 189} Me gusta
              </strong>
            </div>

            <div className="precio-publicacion">
              <span>Disponible para comprar</span>
              <strong>$75</strong>
            </div>

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

export default Publicacion1;
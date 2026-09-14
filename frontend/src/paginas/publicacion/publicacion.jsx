import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import fotoPerfilPropio from '../../assets/imagenes/fotoDePerfilPropio.jpg'
import fotoPropia1 from '../../assets/imagenes/fotoPropia1.jpg'
import fotoPropia2 from '../../assets/imagenes/fotoPropia2.jpg'
import fotoPropia3 from '../../assets/imagenes/fotoPropia3.jpg'
import fotoPropia4 from '../../assets/imagenes/fotoPropia4.jpg'
import Header from "../../componentes/header/header"
import '../publicacion/publicacion.css' 

// Mapa para asignar la imagen local según el ID de la publicación
const mapaFotos = {
  1: fotoPropia1,
  2: fotoPropia2,
  3: fotoPropia3,
  4: fotoPropia4
};

function Publicacion() {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el parámetro de la URL (/publicacion/:id)
  const idPublicacion = Number(id) || 1;

  // Obtenemos el usuario de la sesión guardada en localStorage
  const usuarioSesion = JSON.parse(localStorage.getItem('usuarioLogueado'));
  const idUsuarioActual = usuarioSesion?.id_usuario || 1;

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [totalLikes, setTotalLikes] = useState(189);
  const [comentarios, setComentarios] = useState([
    { usuario: '@fashionlover', texto: 'Me encanta este look ♡' },
    { usuario: '@swiftie13', texto: 'Los colores quedan preciosos!!!' }
  ]);
  const [nuevoComentario, setNuevoComentario] = useState('');

  // 1. Cargar el estado inicial del Me Gusta desde el backend
  useEffect(() => {
    const consultarLikes = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/publicaciones/${idPublicacion}/likes?id_usuario=${idUsuarioActual}`);
        if (response.ok) {
          const data = await response.json();
          setLiked(data.dioLike);
          setTotalLikes(data.totalLikes);
        }
      } catch (error) {
        console.error("Error al consultar likes:", error);
      }
    };

    consultarLikes();
  }, [idPublicacion, idUsuarioActual]);

  // 2. Función para alternar Me Gusta en la API
  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/publicaciones/${idPublicacion}/like?id_usuario=${idUsuarioActual}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.dioLike);
        setTotalLikes(data.totalLikes);
      }
    } catch (error) {
      console.error("Error al procesar me gusta:", error);
    }
  };

  const handleAgregarComentario = (e) => {
    e.preventDefault();
    if (nuevoComentario.trim() === '') return;
    setComentarios([...comentarios, { usuario: '@taylor_swift13', texto: nuevoComentario.trim() }]);
    setNuevoComentario('');
  };

  return (
    <div className="pagina-publicacion">
      <Header />
      <main className="contenido-publicacion">
        <button className="volver" type="button" onClick={() => navigate('/perfil_propio')}>
          ← Volver a mi perfil
        </button>

        <section className="publicacion-card">
          <div className="publicacion-foto">
            <img src={mapaFotos[idPublicacion] || fotoPropia1} alt={`Publicación ${idPublicacion}`} />
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
                <button 
                  type="button" 
                  className={liked ? 'activo-like' : ''} 
                  onClick={handleLike}
                >
                  {liked ? '♥' : '♡'}
                </button>
                <button type="button" className={saved ? 'activo-save' : ''} onClick={() => setSaved(!saved)}>
                  {saved ? '★' : '☆'}
                </button>
                <button type="button" onClick={() => alert('¡Enlace copiado!')}>↗</button>
              </div>
              <strong className="cantidad-likes">{totalLikes} Me gusta</strong>
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

export default Publicacion;
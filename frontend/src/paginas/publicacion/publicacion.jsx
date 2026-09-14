import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import fotoPerfilPropio from '../../assets/imagenes/fotoDePerfilPropio.jpg'
import fotoPropia1 from '../../assets/imagenes/fotoPropia1.jpg'
import fotoPropia2 from '../../assets/imagenes/fotoPropia2.jpg'
import fotoPropia3 from '../../assets/imagenes/fotoPropia3.jpg'
import fotoPropia4 from '../../assets/imagenes/fotoPropia4.jpg'
import Header from "../../componentes/header/header"
import './publicacion.css'

const mapaFotos = {
  1: fotoPropia1,
  2: fotoPropia2,
  3: fotoPropia3,
  4: fotoPropia4
};

function Publicacion() {
  const navigate = useNavigate();
  const { id } = useParams();
  const idPublicacion = Number(id);

  const [menuOpciones, setMenuOpciones] = useState(false);

  // Cargar publicación de localStorage
  const publicacionesGuardadas = JSON.parse(localStorage.getItem('grwm_publicaciones')) || [];
  const postEncontrado = publicacionesGuardadas.find(p => String(p.id) === String(id));

  const fotoAMostrar = postEncontrado?.img || mapaFotos[idPublicacion] || fotoPropia1;
  const descripcionMostrar = postEncontrado?.descripcion || "Un look casual pero con un toque, perfecto para salir y sentirte increíble. ✨";

  const usuarioSesion = JSON.parse(localStorage.getItem('usuarioLogueado'));
  const idUsuarioActual = usuarioSesion?.id_usuario || 1;

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [totalLikes, setTotalLikes] = useState(postEncontrado?.likes || 0);

  // Estado inicial de comentarios (vacío por defecto)
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');

  // Consultar likes en la base de datos
  useEffect(() => {
    const consultarEstadoInicialLike = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/publicaciones/${id}/likes?id_usuario=${idUsuarioActual}`
        );
        if (response.ok) {
          const data = await response.json();
          setLiked(data.dioLike);
          setTotalLikes(data.totalLikes);
        }
      } catch (error) {
        console.error("Error al consultar likes iniciales:", error);
      }
    };

    if (id) {
      consultarEstadoInicialLike();
    }
  }, [id, idUsuarioActual]);

  // Dar o quitar Me Gusta
  const handleLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/publicaciones/${id}/like?id_usuario=${idUsuarioActual}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLiked(data.dioLike);
        setTotalLikes(data.totalLikes);
      }
    } catch (error) {
      console.error("Error al dar me gusta:", error);
    }
  };

  // Agregar comentario localmente
  const handleAgregarComentario = (e) => {
    e.preventDefault();
    if (nuevoComentario.trim() === '') return;
    setComentarios([...comentarios, { usuario: usuarioSesion?.username || '@taylor_swift13', texto: nuevoComentario.trim() }]);
    setNuevoComentario('');
  };

  // Eliminar publicación en MySQL y localStorage
  const handleEliminarPublicacion = async () => {
    const confirmar = window.confirm("¿Estás seguro de que querés eliminar esta publicación?");
    if (!confirmar) return;

    try {
      const response = await fetch(`http://localhost:3000/api/publicaciones/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const publicacionesFiltradas = publicacionesGuardadas.filter(p => String(p.id) !== String(id));
        localStorage.setItem('grwm_publicaciones', JSON.stringify(publicacionesFiltradas));

        alert("Publicación eliminada correctamente.");
        navigate('/perfil_propio');
      } else {
        alert("Ocurrió un error al intentar eliminar la publicación.");
      }
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
    }
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
            <img src={fotoAMostrar} alt={`Publicación ${id}`} />
          </div>

          <div className="publicacion-info">
            
            {/* Encabezado con datos del usuario + Tres puntitos */}
            <div className="usuario-publicacion-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
              <div className="usuario-publicacion" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="avatar-publicacion" onClick={() => navigate('/perfil_propio')} style={{ cursor: 'pointer' }}>
                  <img src={fotoPerfilPropio} alt="Foto de perfil" />
                </div>
                <div>
                  <strong>Taylor Swift</strong>
                  <span>@taylor_swift13</span>
                </div>
              </div>

              {/* Botón de 3 puntitos */}
              <div className="opciones-publicacion" style={{ position: 'relative' }}>
                <button 
                  type="button" 
                  onClick={() => setMenuOpciones(!menuOpciones)}
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#703c5e' }}
                >
                  ⋮
                </button>

                {menuOpciones && (
                  <div className="dropdown-opciones" style={{
                    position: 'absolute',
                    right: 0,
                    top: '30px',
                    background: 'white',
                    border: '1px solid #efd5e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 10
                  }}>
                    <button 
                      type="button" 
                      onClick={handleEliminarPublicacion}
                      style={{
                        padding: '10px 15px',
                        background: 'none',
                        border: 'none',
                        color: '#d93838',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      🗑 Eliminar publicación
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="descripcion-publicacion">
              <p className="descripcion-texto">{descripcionMostrar}</p>
              <span className="fecha">
                {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
              </span>
            </div>

            {/* Botones de interacción (Like, Guardar, Compartir) */}
            <div className="interacciones">
              <div className="iconos-interaccion">
                <button type="button" className={liked ? 'activo-like' : ''} onClick={handleLike}>
                  {liked ? '♥' : '♡'}
                </button>
                <button type="button" className={saved ? 'activo-save' : ''} onClick={() => setSaved(!saved)}>
                  {saved ? '★' : '☆'}
                </button>
                <button type="button" onClick={() => alert('¡Enlace copiado!')}>↗</button>
              </div>
              <strong className="cantidad-likes">
                {totalLikes} Me gusta
              </strong>
            </div>

            {/* Comentarios */}
            <div className="comentarios-contenedor">
              <div className="comentarios">
                {comentarios.length === 0 ? (
                  <p style={{ color: '#9a6685', fontSize: '11px', margin: '10px 0' }}>Sé el primero en comentar...</p>
                ) : (
                  comentarios.map((com, index) => (
                    <div className="comentario" key={index}>
                      <strong>{com.usuario}</strong>
                      <span>{com.texto}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Formulario para comentar */}
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
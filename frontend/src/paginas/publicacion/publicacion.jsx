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

  // Obtenemos los datos del usuario dinámicamente desde localStorage 
  const usuarioSesion = JSON.parse(localStorage.getItem('usuario')) || {}; 
  const idUsuarioActual = usuarioSesion?.id_usuario;

  const nombreUsuarioHeader = usuarioSesion.nombre 
    ? `${usuarioSesion.nombre} ${usuarioSesion.apellido || ''}`.trim() 
    : (usuarioSesion.username || 'Mi Usuario'); 
    
  const usuarioTagHeader = usuarioSesion.username ? `@${usuarioSesion.username}` : '@usuario'; 
  const fotoPerfilHeader = localStorage.getItem('grwm_foto_perfil') || usuarioSesion.foto_perfil || fotoPerfilPropio;

  const [liked, setLiked] = useState(false); 
  const [saved, setSaved] = useState(false); 
  const [totalLikes, setTotalLikes] = useState(postEncontrado?.likes || 0);

  // Estado de comentarios
  const [comentarios, setComentarios] = useState([]); 
  const [nuevoComentario, setNuevoComentario] = useState('');

  // 💬 1. Consultar comentarios reales desde la Base de Datos al cargar la vista
  useEffect(() => {
    const cargarComentariosBD = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:3000/api/publicaciones/${id}/comentarios`);
        if (response.ok) {
          const data = await response.json();
          setComentarios(data);
        }
      } catch (error) {
        console.error("Error al cargar comentarios de la base de datos:", error);
      }
    };

    cargarComentariosBD();
  }, [id]);

  // 2. Consultar estado inicial de Me Gusta en la base de datos 
  useEffect(() => { 
    const consultarEstadoInicialLike = async () => { 
      if (!id || !idUsuarioActual) return; 
      try { 
        const response = await fetch(`http://localhost:3000/api/publicaciones/${id}/likes?id_usuario=${idUsuarioActual}`); 
        if (response.ok) { 
          const data = await response.json(); 
          setLiked(data.dioLike); 
          setTotalLikes(data.totalLikes); 
        } 
      } catch (error) { 
        console.error("Error al consultar likes iniciales:", error); 
      } 
    };

    consultarEstadoInicialLike();
  }, [id, idUsuarioActual]);

  // 3. Consultar estado inicial de Favorito en la base de datos 
  useEffect(() => { 
    const consultarEstadoInicialFavorito = async () => { 
      if (!id || !idUsuarioActual) return; 
      try { 
        const response = await fetch(`http://localhost:3000/api/publicaciones/${id}/favorito?id_usuario=${idUsuarioActual}`); 
        if (response.ok) { 
          const data = await response.json(); 
          setSaved(data.esFavorito); 
        } 
      } catch (error) { 
        console.error("Error al consultar estado inicial de favorito:", error); 
      } 
    };

    consultarEstadoInicialFavorito();
  }, [id, idUsuarioActual]);

  // 4. Alternar Me Gusta (Dar / Quitar) 
  const handleLike = async () => { 
    if (!idUsuarioActual) { 
      alert("Iniciá sesión para dar Me Gusta."); 
      return; 
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/publicaciones/${id}/like?id_usuario=${idUsuarioActual}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLiked(data.dioLike);
        setTotalLikes(data.totalLikes);

        // Actualizamos el total de likes en localStorage
        const publicacionesGuardadas = JSON.parse(localStorage.getItem('grwm_publicaciones')) || [];
        const actualizadas = publicacionesGuardadas.map(p => {
          if (String(p.id) === String(id)) {
            return { ...p, likes: data.totalLikes };
          }
          return p;
        });
        localStorage.setItem('grwm_publicaciones', JSON.stringify(actualizadas));
      }
    } catch (error) {
      console.error("Error al dar me gusta:", error);
    }
  };

  // 5. Alternar Favorito (Guardar / Quitar) 
  const handleToggleFavorito = async () => { 
    if (!idUsuarioActual) { 
      alert("Iniciá sesión para guardar publicaciones."); 
      return; 
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/publicaciones/${id}/favorito?id_usuario=${idUsuarioActual}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSaved(data.esFavorito);
      }
    } catch (error) {
      console.error("Error al cambiar estado de favorito:", error);
    }
  };

  // 6. Copiar enlace real al portapapeles 
  const handleCompartir = async () => { 
    try { 
      await navigator.clipboard.writeText(window.location.href); 
      alert('¡Enlace copiado al portapapeles! 📋'); 
    } catch (error) { 
      console.error("Error al copiar el enlace:", error); 
    } 
  };

  // 📩 7. Guardar un comentario en la Base de Datos y recargar la lista
  const handleAgregarComentario = async (e) => { 
    e.preventDefault(); 

    if (!idUsuarioActual) {
      alert("Iniciá sesión para publicar un comentario.");
      return;
    }

    if (nuevoComentario.trim() === '') return; 

    try {
      const response = await fetch(`http://localhost:3000/api/publicaciones/${id}/comentario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: idUsuarioActual,
          comentario: nuevoComentario.trim()
        })
      });

      if (response.ok) {
        setNuevoComentario('');
        // Se recarga la lista de comentarios para renderizar el recién ingresado
        const resComentarios = await fetch(`http://localhost:3000/api/publicaciones/${id}/comentarios`);
        if (resComentarios.ok) {
          const data = await resComentarios.json();
          setComentarios(data);
        }
      } else {
        alert("No se pudo publicar el comentario.");
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  // 8. Eliminar publicación en MySQL y localStorage 
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
            
            {/* Encabezado con datos dinámicos del usuario + Tres puntitos */}
            <div className="usuario-publicacion-header">
              <div className="usuario-publicacion">
                <div className="avatar-publicacion" onClick={() => navigate('/perfil_propio')} style={{ cursor: 'pointer' }}>
                  <img src={fotoPerfilHeader} alt="Foto de perfil" />
                </div>
                <div>
                  <strong>{nombreUsuarioHeader}</strong>
                  <span>{usuarioTagHeader}</span>
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
                <button 
                  type="button" 
                  className={saved ? 'activo-save' : ''} 
                  onClick={handleToggleFavorito}
                >
                  {saved ? '★' : '☆'}
                </button>
                <button type="button" onClick={handleCompartir}>↗</button>
              </div>
              <strong className="cantidad-likes">
                {totalLikes} Me gusta
              </strong>
            </div>

            {/* Comentarios renderizados desde la base de datos */}
            <div className="comentarios-contenedor">
              <div className="comentarios">
                {comentarios.length === 0 ? (
                  <p style={{ color: '#9a6685', fontSize: '11px', margin: '10px 0' }}>Sé el primero en comentar...</p>
                ) : (
                  comentarios.map((com) => (
                    <div className="comentario" key={com.id_comentario || com.id}>
                      <strong>{com.username ? `@${com.username}` : (com.usuario || '@usuario')}</strong>
                      <span>{com.comentario || com.texto}</span>
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
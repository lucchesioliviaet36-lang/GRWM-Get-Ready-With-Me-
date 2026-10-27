import './pagina_principal.css';
import { useState, useEffect } from 'react';

import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";

export default function Feed() {

  // ==========================================
  // ESTADOS
  // ==========================================

  const [siguiendo, setSiguiendo] = useState({});
  const [likes, setLikes] = useState({});
  const [guardados, setGuardados] = useState({});
  const [corazonGrande, setCorazonGrande] = useState(null);
  const [historiaActiva, setHistoriaActiva] = useState(null);
  const [comentario, setComentario] = useState('');//nuevo
  const [liked, setLiked] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // 1. Recuperamos el token guardado en el navegador al hacer login
    const token = localStorage.getItem('token'); 

    // 2. Hacemos el fetch mandando el token en los headers
    fetch('http://localhost:3000/api/publicaciones', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` // Mandamos el token en la cabecera
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(JSON.stringify(data, null, 2));        
        // Verificamos si llegó un array directo o dentro de una propiedad
        if (Array.isArray(data)) { 
          setPublicaciones(data);
        } else if (data.publicaciones && Array.isArray(data.publicaciones)) {
          setPublicaciones(data.publicaciones);
        } else {
          setPublicaciones([]);
        }
        
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al conectar con el backend:', err);
        setCargando(false);
      });
  }, []);
  // ==========================================
  // FUNCIONES DE HISTORIAS (CON VERIFICACIÓN SEGURA)
  // ==========================================

  const abrirHistoria = (historia, index = 0) => {
    if (!historia) return;
    setHistoriaActiva(historia);
    setIndiceActual(index);
    setProgreso(0);
    setPausado(false);
    setLiked(false);
    setComentario('');
  };

  const cerrarHistoria = () => {
    setHistoriaActiva(null);
    setProgreso(0);
    setPausado(false);
  };

  const siguienteHistoria = () => {
    if (typeof historias !== 'undefined' && historias && indiceActual < historias.length - 1) {
      const siguienteIndex = indiceActual + 1;
      setIndiceActual(siguienteIndex);
      setHistoriaActiva(historias[siguienteIndex]);
      setProgreso(0);
      setLiked(false);
      setComentario('');
    } else {
      cerrarHistoria();
    }
  };

  const anteriorHistoria = () => {
    if (typeof historias !== 'undefined' && historias && indiceActual > 0) {
      const anteriorIndex = indiceActual - 1;
      setIndiceActual(anteriorIndex);
      setHistoriaActiva(historias[anteriorIndex]);
      setProgreso(0);
      setLiked(false);
      setComentario('');
    }
  };

  const handleEnviarComentario = (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;
    alert(`Mensaje enviado a ${historiaActiva.usuario}`);
    setComentario('');
  };
  // AGREGAR: Estados para la barra de progreso y el índice de la historia
  const [pausado, setPausado] = useState(false);// Estado para pausar la historia al hacer clic
  const [progreso, setProgreso] = useState(0);       // Porcentaje de la barra (0 a 100)
  const [indiceActual, setIndiceActual] = useState(0); // Posición de la historia visible

  // // 2. AGREGAR: Tiempos de duración
  const DURACION_HISTORIA = 10000; // Duración de cada historia en milisegundos (10 segundos)
  const INTERVALO_BARRA = 100;     // Actualización cada 100ms

  
  // ==========================================
  // HISTORIAS
  // ==========================================

  const historias = [
    {
      id: 1,
      usuario: 'Tu historia',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
      esUsuario: true
    },
    {
      id: 2,
      usuario: 'clara.v',
      img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop'
    },
    {
      id: 3,
      usuario: 'hugo_st',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop'
    },
    {
      id: 4,
      usuario: 'sofia.art',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop'
    },
    {
      id: 5,
      usuario: 'brian_m',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop'
    },
    {
      id: 6,
      usuario: 'mora_closet',
      img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop'
    }
  ];

  useEffect(() => {
    if (!historiaActiva || pausado) return; // Si está pausado, se congelan los timers

    const timerProgreso = setInterval(() => {
      setProgreso((prev) => {
        if (prev >= 100) return 100;
        return prev + (INTERVALO_BARRA / DURACION_HISTORIA) * 100;
      });
    }, INTERVALO_BARRA);

    const timerCambio = setTimeout(() => {
      siguienteHistoria();
    }, DURACION_HISTORIA * (1 - progreso / 100)); // Tiempo restante proporcional

    return () => {
      clearInterval(timerProgreso);
      clearTimeout(timerCambio);
    };
  }, [historiaActiva, indiceActual, pausado]);
  {/* Solo renderiza si historiaActiva tiene datos */}
  
{/* VISOR DE HISTORIAS MODAL */}
      {historiaActiva && (
        <div className="historias-overlay">
          <div className="historias-contenedor">
            
            {/* Barra de progreso */}
            <div className="barras-progreso-contenedor">
              <div className="barra-fondo">
                <div 
                  className="barra-relleno"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>

            {/* Cabecera (Se oculta si querés al estar pausado) */}
            <div className={`historias-header ${pausado ? 'oculto' : ''}`}>
              <img 
                src={historiaActiva?.avatar || historiaActiva?.img} 
                alt={historiaActiva?.usuario || 'Usuario'} 
                className="historia-avatar" 
              />
              <span className="historia-usuario">{historiaActiva?.usuario}</span>
              <button className="btn-cerrar-historia" onClick={cerrarHistoria}>✕</button>
            </div>

            {/* Imagen principal con eventos de mantener presionado */}
            <div 
              className="historia-contenido"
              onMouseDown={() => setPausado(true)}  // En PC: Al presionar click
              onMouseUp={() => setPausado(false)}    // En PC: Al soltar click
              onTouchStart={() => setPausado(true)} // En celular: Al tocar pantalla
              onTouchEnd={() => setPausado(false)}   // En celular: Al levantar el dedo
            >
              <img 
                src={historiaActiva?.imagen || historiaActiva?.img} 
                alt="Historia" 
                className="historia-img" 
              />

              {/* Zonas de toque lateral para avanzar/retroceder al hacer clic simple */}
              <div 
                className="touch-zone izq" 
                onClick={(e) => {
                  e.stopPropagation();
                  anteriorHistoria();
                }} 
              />
              <div 
                className="touch-zone der" 
                onClick={(e) => {
                  e.stopPropagation();
                  siguienteHistoria();
                }} 
              />
            </div>

          </div>
        </div>
      )}



  // ==========================================
  // SUGERENCIAS
  // ==========================================

  const sugerencias = [
    {
      nombre: 'Lucía M.',
      handle: 'luciatrends',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop'
    },

    {
      nombre: 'Marcos V.',
      handle: 'marcos_fit',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop'
    },

    {
      nombre: 'Sonia Vintage',
      handle: 'sonia_retro',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop'
    }
  ];


  // ==========================================
  // SEGUIR
  // ==========================================

  const toggleSeguir = (handle) => {

    setSiguiendo((prev) => ({
      ...prev,
      [handle]: !prev[handle]
    }));

  };


  // ==========================================
  // LIKE
  // ==========================================

  const toggleLike = (id) => {

    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));

  };


  // ==========================================
  // GUARDAR
  // ==========================================

  const toggleGuardar = (id) => {

    setGuardados((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));

  };


  // ==========================================
  // DOBLE CLICK
  // ==========================================

  const handleDobleClic = (id) => {

    setLikes((prev) => ({
      ...prev,
      [id]: true
    }));

    setCorazonGrande(id);

    setTimeout(() => {
      setCorazonGrande(null);
    }, 900);

  };


  // ==========================================
  // RETURN
  // ==========================================

  return (

    <div className="feed-page">


      {/* HEADER */}

        <Header />



      {/* CUERPO */}

      <div className="feed-body">


        {/* ==================================
            SIDEBAR
        =================================== */}

        <aside className="sidebar">


          {/* Tendencias */}

          <div className="card-box">

            <h3>
              Tendencias para ti
            </h3>

            <ul className="trends-list">

              <li>
                <span>#OOTDMinimal</span>
                <small>1.2k posts</small>
              </li>

              <li>
                <span>#CottageCore</span>
                <small>1.2k posts</small>
              </li>

              <li>
                <span>#StreetwearSp</span>
                <small>1.2k posts</small>
              </li>

              <li>
                <span>#SecondHandFinds</span>
                <small>1.2k posts</small>
              </li>

              <li>
                <span>#Y2KRevival</span>
                <small>1.2k posts</small>
              </li>

            </ul>

          </div>



          {/* Sugerencias */}

          <div className="card-box">

            <h3>
              Sugerencias
            </h3>

            <ul className="suggestions-list">

              {sugerencias.map((persona) => (

                <li key={persona.handle}>

                  <img
                    src={persona.avatar}
                    alt={persona.nombre}
                  />

                  <div className="suggestion-info">

                    <strong>
                      {persona.nombre}
                    </strong>

                    <small>
                      @{persona.handle}
                    </small>

                  </div>

                  <button
                    className={
                      `btn-follow ${
                        siguiendo[persona.handle]
                          ? 'siguiendo'
                          : ''
                      }`
                    }

                    onClick={() =>
                      toggleSeguir(persona.handle)
                    }
                  >

                    {siguiendo[persona.handle]
                      ? 'Siguiendo'
                      : 'Seguir'}

                  </button>

                </li>

              ))}

            </ul>

          </div>

        </aside>

        


        {/* ==================================
            FEED
        =================================== */}

        <main className="feed-content">


          {/* CONTENEDOR CENTRAL */}

          <div className="feed-inner">


            {/* ==================================
                HISTORIAS
            =================================== */}

            <section className="stories-bar">

              {historias.map((historia) => (

                <div
                  className="story-item"
                  key={historia.id}
                  onClick={() => setHistoriaActiva(historia)} 
                >

                  <div
                    className={
                      `avatar-ring ${
                        historia.esUsuario
                          ? 'user-story'
                          : ''
                      }`
                    }
                  >

                    <img
                      src={historia.img}
                      alt={historia.usuario}
                    />

                  </div>

                  <span>
                    {historia.usuario}
                  </span>

                </div>

              ))}

            </section>

            {/* Ventana flotante de la historia */}
            {historiaActiva && (
              <div className="story-modal-overlay" onClick={() => setHistoriaActiva(null)}>
                <div className="story-modal-content" onClick={(e) => e.stopPropagation()}>
                  
                  {/* Cabecera */}
                  <div className="story-header">
                    <img src={historiaActiva.img} alt={historiaActiva.usuario} className="story-header-avatar" />
                    <span>{historiaActiva.usuario}</span>
                    <button className="story-close-btn" onClick={() => setHistoriaActiva(null)}>✕</button>
                  </div>

                  {/* Imagen de la historia */}
                  <div className="story-body">
                    <img src={historiaActiva.contenidoImg || historiaActiva.img} alt="Historia" />
                  </div>

                  {/* Barra inferior de interacciones */}
                  <div className="story-footer">
                    <form className="story-comment-form" onSubmit={handleEnviarComentario}>
                      <input
                        type="text"
                        placeholder={`Enviar mensaje a ${historiaActiva.usuario}...`}
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                      />
                      {comentario.trim() && (
                        <button type="submit" className="story-send-btn">Enviar</button>
                      )}
                    </form>

                    <button 
                      className={`story-like-btn ${liked ? 'liked' : ''}`}
                      onClick={() => setLiked(!liked)}
                    >
                      {liked ? '❤️' : '🤍'}
                    </button>
                  </div>

                </div>
              </div>
            )}
            {/* ==================================
                PUBLICACIONES
            =================================== */}

            <section className="posts-grid">
              {publicaciones.map((post) => {
                // Definimos un ID seguro para usar en todo el post (ya que tu BD usa id_publicacion)
                const postId = post.id_publicacion || post.id;

                return (
                  <article
                    className="post-card"
                    key={postId} /* <-- Soluciona el warning de la key */
                  >
                    {/* Imagen */}
                    <div
                      className="image-container"
                      onDoubleClick={() => handleDobleClic(postId)}
                    >
                      <img
                        src={`http://localhost:3000${post.imagen_url}`} /* <-- Une el servidor con la ruta de la BD */
                        alt={post.descripcion || "Publicación"}
                      />

                      {post.precio && (
                        <span className="price-tag">
                          {post.precio}
                        </span>
                      )}

                      {corazonGrande === postId && (
                        <div className="corazon-overlay">
                          ♥
                        </div>
                      )}
                    </div>

                    {/* Usuario (Si no viene el usuario en texto, ponemos un genérico o el ID) */}
                    <div className="post-header">
                      <div className="user-info">
                        <img
                          className="user-avatar"
                          src={post.avatar || "http://localhost:3000/uploads/default-avatar.png"} 
                          alt="Avatar"
                        />
                        <strong>
                          {post.usuario || `Usuario #${post.id_usuario}`}
                        </strong>
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="post-description">
                      {post.descripcion}
                    </p>

                    {/* Footer */}
                    <div className="post-footer">
                      <div className="stats">
                        <button
                          className={`btn-icon ${likes[postId] ? 'liked' : ''}`}
                          onClick={() => toggleLike(postId)}
                        >
                          {likes[postId] ? '♥' : '♡'}
                        </button>

                        {/* Protegido para que no devuelva NaN */}
                        <span>
                          {(Number(post.likesCount) || 0) + (likes[postId] ? 1 : 0)}
                        </span>

                        <button className="comment-button">
                          ♡
                        </button>

                        {/* Protegido contra NaN */}
                        <span>
                          {Number(post.comentarios) || 0}
                        </span>
                      </div>

                      <button
                        className={`btn-save ${guardados[postId] ? 'guardado' : ''}`}
                        onClick={() => toggleGuardar(postId)}
                      >
                        {guardados[postId] ? '🔖' : '♧'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>


          </div>

        </main>

      </div>



      {/* FOOTER */}

      <footer className="feed-footer">
        <Footer />
      </footer>


    </div>
  );
}
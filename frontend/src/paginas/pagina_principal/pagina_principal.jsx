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
  };//nuevo
  // // 1. AGREGAR: Estados para la barra de progreso y el índice de la historia
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
  // PUBLICACIONES
  // ==========================================

  const publicaciones = [

    {
      id: 1,
      usuario: 'clara.v',
      avatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop',
      imagen:
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop',
      precio: '€85',
      descripcion:
        'Enamorada de este trench coat que conseguí en una tienda vintage de Berlín. Combina con todo ☕✨',
      likesCount: 340,
      comentarios: 42
    },

    {
      id: 2,
      usuario: 'hugo_st',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
      imagen:
        'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop',
      precio: null,
      descripcion:
        'Paleta de grises y neutros para una tarde fresca en la ciudad. ¿Qué opinan de esta campera?',
      likesCount: 512,
      comentarios: 19
    },

    {
      id: 3,
      usuario: 'mora_closet',
      avatar:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop',
      imagen:
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop',
      precio: '€120',
      descripcion:
        'Bolso estructurado de piel vacuno. Un clásico que nunca pasa de moda.',
      likesCount: 289,
      comentarios: 15
    },

    {
      id: 4,
      usuario: 'sofia.art',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
      imagen:
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop',
      precio: '€45',
      descripcion:
        'Remera polo tejida de rayas pastel. Ideal para días soleados.',
      likesCount: 410,
      comentarios: 28
    }

  ];


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

      <header className="feed-header">
        <Header />
      </header>



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

              {publicaciones.map((post) => (

                <article
                  className="post-card"
                  key={post.id}
                >


                  {/* Imagen */}

                  <div
                    className="image-container"

                    onDoubleClick={() =>
                      handleDobleClic(post.id)
                    }
                  >

                    <img
                      src={post.imagen}
                      alt={`Outfit de ${post.usuario}`}
                    />


                    {post.precio && (

                      <span className="price-tag">
                        {post.precio}
                      </span>

                    )}


                    {corazonGrande === post.id && (

                      <div className="corazon-overlay">
                        ♥
                      </div>

                    )}

                  </div>



                  {/* Usuario */}

                  <div className="post-header">

                    <div className="user-info">

                      <img
                        className="user-avatar"
                        src={post.avatar}
                        alt={post.usuario}
                      />

                      <strong>
                        {post.usuario}
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
                        className={
                          `btn-icon ${
                            likes[post.id]
                              ? 'liked'
                              : ''
                          }`
                        }

                        onClick={() =>
                          toggleLike(post.id)
                        }
                      >
                        {likes[post.id]
                          ? '♥'
                          : '♡'}
                      </button>


                      <span>
                        {post.likesCount +
                          (likes[post.id]
                            ? 1
                            : 0)}
                      </span>


                      <button className="comment-button">
                        ♡
                      </button>


                      <span>
                        {post.comentarios}
                      </span>

                    </div>


                    <button
                      className={
                        `btn-save ${
                          guardados[post.id]
                            ? 'guardado'
                            : ''
                        }`
                      }

                      onClick={() =>
                        toggleGuardar(post.id)
                      }
                    >

                      {guardados[post.id]
                        ? '🔖'
                        : '♧'}

                    </button>

                  </div>


                </article>

              ))}

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
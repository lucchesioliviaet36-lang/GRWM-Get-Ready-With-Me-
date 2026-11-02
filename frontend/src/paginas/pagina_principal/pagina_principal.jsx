import './pagina_principal.css';
import { useState, useEffect } from 'react';

import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";


const API_URL = "http://localhost:3000"; 

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
  const [historias, setHistorias] = useState([]);
  const [pausado, setPaused] = useState(false); // Estado para pausar la historia
  const [progreso, setProgreso] = useState(0); 
  const [indiceActual, setIndiceActual] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario")) || {};
  const [mostrarCrearHistoria, setMostrarCrearHistoria] = useState(false);// Estado para mostrar u ocultar la vista de crear historia

  const obtenerFotoPerfil = () => {
    const foto = usuario?.foto_perfil || usuarioGuardado.foto_perfil;

    if (!foto) {
      return null;
    }

    if (foto.startsWith("http")) {
      return foto;
    }

    return `${API_URL}${foto}`;
  };

  const fotoPerfilHeader = obtenerFotoPerfil(); 
  

  // ==========================================
  // TIMERS Y FETCH DE DATOS (USEEFFECTS)
  // ==========================================
  const DURACION_HISTORIA = 10000; // 10 segundos
  const INTERVALO_BARRA = 100;    

  // Fetch de historias
  useEffect(() => {
    const token = localStorage.getItem('token'); 

    fetch('http://localhost:3000/api/historias', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Historias que llegaron del backend:", data);
        if (Array.isArray(data)) {
          setHistorias(data);
        } else if (data.historias && Array.isArray(data.historias)) {
          setHistorias(data.historias);
        } else {
          setHistorias([]);
        }
      })
      .catch((err) => {
        console.error('Error al conectar con el backend para historias:', err);
      });
  }, []);

  // Fetch de publicaciones
  useEffect(() => {
    const token = localStorage.getItem('token'); 

    fetch('http://localhost:3000/api/publicaciones', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(JSON.stringify(data, null, 2));        
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

  // Efecto de la barra de progreso de la historia
  useEffect(() => {
    if (!historiaActiva || pausado) return; 

    const timerProgreso = setInterval(() => {
      setProgreso((prev) => {
        if (prev >= 100) return 100;
        return prev + (INTERVALO_BARRA / DURACION_HISTORIA) * 100;
      });
    }, INTERVALO_BARRA);

    const timerCambio = setTimeout(() => {
      siguienteHistoria();
    }, DURACION_HISTORIA * (1 - progreso / 100)); 

    return () => {
      clearInterval(timerProgreso);
      clearTimeout(timerCambio);
    };
  }, [historiaActiva, indiceActual, pausado, progreso]);

  // ==========================================
  // FUNCIONES DE HISTORIAS
  // ==========================================
  const abrirHistoria = (historia, index = 0) => {
    if (!historia) return;
    setHistoriaActiva(historia);
    setIndiceActual(index);
    setProgreso(0);
    setPaused(false);
    setLiked(false);
    setComentario('');
  };

  const cerrarHistoria = () => {
    setHistoriaActiva(null);
    setProgreso(0);
    setPaused(false);
  };

  const siguienteHistoria = () => {
    if (historias && indiceActual < historias.length - 1) {
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
    if (historias && indiceActual > 0) {
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
{/* Burbuja de tu propia historia / perfil */}
<div 
  className="historia-burbuja"
  onClick={() => {
    // Buscamos si hay una historia tuya en el array
    const miHistoria = historias.find(h => h.id_usuario === miIdDeUsuario); // o tu lógica para identificar tu historia

    if (miHistoria) {
      // Si ya tenés una historia, la abrís para verla
      abrirHistoria(miHistoria);
    } else {
      // Si NO hay ninguna historia, te lleva a crear una
      setMostrarCrearHistoria(true); // O la función que uses para abrir el componente CrearHistoria
    }
  }}
>
  <div className="avatar-container">
    <img src={miAvatar || "http://localhost:3000/uploads/default-avatar.png"} alt="Mi perfil" />
    
    {/* Si no hay historia, le mostramos un "+" estético abajo/al costado */}
    {!historias.some(h => h.id_usuario === miIdDeUsuario) && (
      <span className="badge-mas">+</span>
    )}
  </div>
  <span>Tu historia</span>
</div>
  // ==========================================
  // OTRAS FUNCIONES (SUGERENCIAS, LIKES, ETC.)
  // ==========================================
  const sugerencias = [
    {
      nombre: 'Lucía M.',
      handle: 'luciatrends',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop'
    },
    {
      nombre: 'Marcos V.',
      handle: 'marcos_fit',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop'
    },
    {
      nombre: 'Sonia Vintage',
      handle: 'sonia_retro',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop'
    }
  ];

  const toggleSeguir = (handle) => {
    setSiguiendo((prev) => ({ ...prev, [handle]: !prev[handle] }));
  };

  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleGuardar = (id) => {
    setGuardados((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDobleClic = (id) => {
    setLikes((prev) => ({ ...prev, [id]: true }));
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

            <section className="stories-bar">

              {/* 1. Círculo FIJO de "Tu historia" (siempre visible primero) */}
              <div
                className="story-item"
                onClick={() => {
                  // Acá ponés la función para abrir tu modal de subir historia o ver la tuya
                  console.log("Crear o ver mi historia");
                }} 
              >
                <div className="avatar-ring user-story">

                  {fotoPerfilHeader && (
                  <img
                    src={fotoPerfilHeader}
                    alt="Tu historia"
                  />
                )}
                  
                </div>
                <span>Tu historia</span>
              </div>

              {/* 2. Mapeo de las historias que vienen de la base de datos */}
              {historias.map((historia) => {
                const historiaId = historia.id_historia || historia.id;

                return (
                  <div
                    className="story-item"
                    key={historiaId}
                    onClick={() => setHistoriaActiva(historia)} 
                  >
                    <div className="avatar-ring">
                      <img
                        src={`http://localhost:3000${historia.imagen_url}`} 
                        alt={historia.usuario || "Historia"}
                      />
                    </div>
                    <span>
                      {historia.usuario || `Usuario #${historia.id_usuario}`}
                    </span>
                  </div>
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
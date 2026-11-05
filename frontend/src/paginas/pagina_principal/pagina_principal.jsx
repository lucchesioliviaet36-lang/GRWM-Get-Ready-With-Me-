import './pagina_principal.css';
import { useState, useEffect } from 'react';

import Header from '../../componentes/header/header';
import Footer from '../../componentes/footer/footer';
import { CrearHistoria } from '../crear_historia/crear_historia';

const API_URL = 'http://localhost:3000';

export default function Feed() {
  const [siguiendo, setSiguiendo] = useState({});
  const [likes, setLikes] = useState({});
  const [guardados, setGuardados] = useState({});
  const [corazonGrande, setCorazonGrande] = useState(null);
  const [historiaActiva, setHistoriaActiva] = useState(null);
  const [comentario, setComentario] = useState('');
  const [liked, setLiked] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [historias, setHistorias] = useState([]);
  const [pausado, setPaused] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [indiceActual, setIndiceActual] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const [usuarioGuardado, setUsuarioGuardado] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('usuario')) || {};
    } catch (error) {
      return {};
    }
  });
  const [mostrarCrearHistoria, setMostrarCrearHistoria] = useState(false);

  const obtenerFotoPerfil = () => {
    const foto = usuario?.foto_perfil || usuarioGuardado?.foto_perfil;
    if (!foto) return null;
    if (foto.startsWith('http')) return foto;
    return API_URL + foto;
  };

  const fotoPerfilHeader = obtenerFotoPerfil();

  const obtenerImagenHistoria = (imagenUrl) => {
    if (!imagenUrl) {
      return 'http://localhost:3000/uploads/default-story.png';
    }

    if (imagenUrl.startsWith('http')) {
      return imagenUrl;
    }

    return API_URL + imagenUrl;
  };

  const DURACION_HISTORIA = 10000;
  const INTERVALO_BARRA = 100;

  const cargarHistorias = () => {
    const token = localStorage.getItem('token');
    const authHeader = token ? 'Bearer ' + token : '';

    fetch(API_URL + '/api/historias', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Historias que llegaron del backend:', data);

        if (Array.isArray(data)) {
          setHistorias(data);
        } else if (data && Array.isArray(data.historias)) {
          setHistorias(data.historias);
        } else {
          setHistorias([]);
        }
      })
      .catch((err) => {
        console.error('Error al conectar con el backend para historias:', err);
      });
  };

  useEffect(() => {
    cargarHistorias();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const authHeader = token ? 'Bearer ' + token : '';

    fetch(API_URL + '/api/publicaciones', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(JSON.stringify(data, null, 2));

        if (Array.isArray(data)) {
          setPublicaciones(data);
        } else if (data && Array.isArray(data.publicaciones)) {
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
    if (historias.length > 0 && indiceActual < historias.length - 1) {
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
    if (historias.length > 0 && indiceActual > 0) {
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
    alert('Mensaje enviado a ' + (historiaActiva?.usuario || 'usuario'));
    setComentario('');
  };

  const sugerencias = [
    {
      nombre: 'Lucía M.',
      handle: 'luciatrends',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
    },
    {
      nombre: 'Marcos V.',
      handle: 'marcos_fit',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop',
    },
    {
      nombre: 'Sonia Vintage',
      handle: 'sonia_retro',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop',
    },
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

  const miId = usuarioGuardado?.id ?? usuarioGuardado?.id_usuario ?? null;
  const tieneMiHistoria = historias.some((historia) => Number(historia.id_usuario) === Number(miId));

  return (
    <div className='feed-page'>
      <Header />

      <div className='feed-body'>
        <aside className='sidebar'>
          <div className='card-box'>
            <h3>Tendencias para ti</h3>
            <ul className='trends-list'>
              <li><span>#OOTDMinimal</span><small>1.2k posts</small></li>
              <li><span>#CottageCore</span><small>1.2k posts</small></li>
              <li><span>#StreetwearSp</span><small>1.2k posts</small></li>
              <li><span>#SecondHandFinds</span><small>1.2k posts</small></li>
              <li><span>#Y2KRevival</span><small>1.2k posts</small></li>
            </ul>
          </div>

          {mostrarCrearHistoria && (
            <CrearHistoria
              onVolver={() => setMostrarCrearHistoria(false)}
              onHistoriaCreada={cargarHistorias}
            />
          )}

          <div className='card-box'>
            <h3>Sugerencias</h3>
            <ul className='suggestions-list'>
              {sugerencias.map((persona) => (
                <li key={persona.handle}>
                  <img src={persona.avatar} alt={persona.nombre} />
                  <div className='suggestion-info'>
                    <strong>{persona.nombre}</strong>
                    <small>@{persona.handle}</small>
                  </div>
                  <button
                    className={'btn-follow ' + (siguiendo[persona.handle] ? 'siguiendo' : '')}
                    onClick={() => toggleSeguir(persona.handle)}
                  >
                    {siguiendo[persona.handle] ? 'Siguiendo' : 'Seguir'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className='feed-content'>
          <div className='feed-inner'>
            <section className='stories-bar'>
              <div
                className='story-item'
                onClick={() => {
                  const miHistoria = historias.find((historia) => Number(historia.id_usuario) === Number(miId));

                  if (miHistoria) {
                    abrirHistoria(miHistoria);
                  } else {
                    setMostrarCrearHistoria(true);
                  }
                }}
              >
                <div className='avatar-ring user-story'>
                  {fotoPerfilHeader ? (
                    <img src={fotoPerfilHeader} alt='Tu historia' />
                  ) : (
                    <img src='http://localhost:3000/uploads/default-avatar.png' alt='Tu historia' />
                  )}

                  {!tieneMiHistoria && <span className='badge-mas'>+</span>}
                </div>
                <span>Tu historia</span>
              </div>

              {historias
                .filter((historia) => Number(historia.id_usuario) !== Number(miId))
                .map((historia) => {
                  const historiaId = historia.id_historia || historia.id;

                  return (
                    <div className='story-item' key={historiaId} onClick={() => abrirHistoria(historia)}>
                      <div className='avatar-ring'>
                        <img src={obtenerImagenHistoria(historia.imagen_url)} alt={historia.usuario || 'Historia'} />
                      </div>
                      <span>{historia.usuario || 'Usuario #' + historia.id_usuario}</span>
                    </div>
                  );
                })}
            </section>

            {historiaActiva && (
              <div className='story-modal-overlay' onClick={() => setHistoriaActiva(null)}>
                <div className='story-modal-content' onClick={(e) => e.stopPropagation()}>
                  <div className='story-header'>
                    <img
                      src={obtenerImagenHistoria(historiaActiva.imagen_url)}
                      alt={historiaActiva.usuario || 'Historia'}
                      className='story-header-avatar'
                    />
                    <span>{historiaActiva.usuario || 'Usuario #' + historiaActiva.id_usuario}</span>
                    <button className='story-close-btn' onClick={() => setHistoriaActiva(null)}>✕</button>
                  </div>

                  <div className='story-body'>
                    <img src={obtenerImagenHistoria(historiaActiva.imagen_url)} alt='Historia' />
                  </div>

                  <div className='story-footer'>
                    <form className='story-comment-form' onSubmit={handleEnviarComentario}>
                      <input
                        type='text'
                        placeholder={'Enviar mensaje a ' + (historiaActiva.usuario || 'usuario') + '...'}
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                      />
                      {comentario.trim() && (
                        <button type='submit' className='story-send-btn'>Enviar</button>
                      )}
                    </form>

                    <button className={'story-like-btn ' + (liked ? 'liked' : '')} onClick={() => setLiked(!liked)}>
                      {liked ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className='feed-footer'>
        <Footer />
      </footer>
    </div>
  );
}
